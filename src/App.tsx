/**
 * Parking Lot Manager - Main Application Component
 * 
 * This React component implements a web interface for parking lot managers to
 * allocate vehicles to spaces using memory allocation strategies (best-fit, first-fit,
 * worst-fit). It features a dynamic vehicle queue, parking grid, and charts to monitor
 * occupancy, efficiency, and queue status.
 * 
 * @version 0.4.0
 */

import React, { ChangeEvent, useState, useRef } from 'react';
import './App.css';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';
import ParkingLotGrid from './components/ParkingLotGrid';
import OccupancyChart from './components/OccupancyChart';
import EfficiencyChart from './components/EfficiencyChart';
import UsageChart from './components/UsageChart';

type Strategy = 'best-fit' | 'first-fit' | 'worst-fit';
type VehicleType = 'Motorcycle' | 'Sedan' | 'SUV';

interface Allocation {
  vehicleSize: number;
  spaceIndex: number;
}

class ParkingLot {
  private blocks: number[];
  public allocations: Allocation[];
  public processesAllocated: number;

  constructor(initialSpaces: number[]) {
    this.blocks = [...initialSpaces];
    this.allocations = [];
    this.processesAllocated = 0;
  }

  allocateSpace(vehicleSize: number, strategy: Strategy): boolean {
    switch (strategy) {
      case 'best-fit': return this.allocateBestFit(vehicleSize);
      case 'first-fit': return this.allocateFirstFit(vehicleSize);
      case 'worst-fit': return this.allocateWorstFit(vehicleSize);
      default: return false;
    }
  }

  private allocateBestFit(vehicleSize: number): boolean {
    let bestIndex = -1;
    let minWaste = Infinity;

    for (let i = 0; i < this.blocks.length; i++) {
      if (this.blocks[i] >= vehicleSize && this.blocks[i] - vehicleSize < minWaste) {
        bestIndex = i;
        minWaste = this.blocks[i] - vehicleSize;
      }
    }

    return this.performAllocation(vehicleSize, bestIndex);
  }

  private allocateFirstFit(vehicleSize: number): boolean {
    for (let i = 0; i < this.blocks.length; i++) {
      if (this.blocks[i] >= vehicleSize) {
        return this.performAllocation(vehicleSize, i);
      }
    }
    return false;
  }

  private allocateWorstFit(vehicleSize: number): boolean {
    let worstIndex = -1;
    let maxWaste = -1;

    for (let i = 0; i < this.blocks.length; i++) {
      if (this.blocks[i] >= vehicleSize && this.blocks[i] - vehicleSize > maxWaste) {
        worstIndex = i;
        maxWaste = this.blocks[i] - vehicleSize;
      }
    }

    return this.performAllocation(vehicleSize, worstIndex);
  }

  private performAllocation(vehicleSize: number, blockIndex: number): boolean {
    if (blockIndex === -1 || this.blocks[blockIndex] < vehicleSize) {
      return false;
    }

    this.blocks[blockIndex] -= vehicleSize;
    this.allocations.push({
      vehicleSize,
      spaceIndex: blockIndex
    });
    this.processesAllocated++;
    return true;
  }

  calculateWastedSpace(): number {
    return this.blocks.reduce((sum, block) => sum + block, 0);
  }

  getSuccessRate(totalProcesses: number): number {
    return totalProcesses > 0 ? (this.processesAllocated / totalProcesses) * 100 : 0;
  }

  getCurrentBlocks(): number[] {
    return [...this.blocks];
  }
}

const vehicleTypeSizes: Record<VehicleType, number> = {
  Motorcycle: 1,
  Sedan: 2,
  SUV: 3
};

const strategyDescriptions: Record<Strategy, string> = {
  'best-fit': 'Allocates to the smallest space that fits, optimizing space usage.',
  'first-fit': 'Uses the first space large enough, for quick allocation.',
  'worst-fit': 'Chooses the largest space, reducing fragmentation.'
};

function App() {
  const [spaces, setSpaces] = useState<number[]>([]);
  const [spaceInput, setSpaceInput] = useState<string>('');
  const [vehicleType, setVehicleType] = useState<VehicleType>('Sedan');
  const [vehicleQueue, setVehicleQueue] = useState<number[]>([]);
  const [allocationStrategy, setAllocationStrategy] = useState<Strategy>('best-fit');
  const [error, setError] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const parkingLotRef = useRef<ParkingLot | null>(null);
  const [results, setResults] = useState<{
    allocations: Allocation[];
    wastedSpace: number;
    successRate: number;
  }>({ allocations: [], wastedSpace: 0, successRate: 0 });

  const handleSpaceInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSpaceInput(value);
    
    const sizes = value
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map(Number)
      .filter(num => num > 0 && Number.isInteger(num));
    
    setSpaces(sizes);
    setError('');
  };

  const handleAddVehicle = () => {
    setVehicleQueue([...vehicleQueue, vehicleTypeSizes[vehicleType]]);
    setError('');
  };

  const handleRemoveVehicle = (index: number) => {
    const newQueue = [...vehicleQueue];
    newQueue.splice(index, 1);
    setVehicleQueue(newQueue);
  };

  const handleRunSimulation = () => {
    if (spaces.length === 0) {
      setError('Please enter at least one parking space size.');
      return;
    }
    if (vehicleQueue.length === 0) {
      setError('Please add at least one vehicle to the queue.');
      return;
    }

    parkingLotRef.current = new ParkingLot(spaces);
    const allocations: Allocation[] = [];

    vehicleQueue.forEach(size => {
      const allocated = parkingLotRef.current?.allocateSpace(size, allocationStrategy);
      if (allocated && parkingLotRef.current) {
        allocations.push(parkingLotRef.current.allocations[parkingLotRef.current.allocations.length - 1]);
      }
    });

    const wastedSpace = parkingLotRef.current?.calculateWastedSpace() || 0;
    const successRate = parkingLotRef.current?.getSuccessRate(vehicleQueue.length) || 0;

    setResults({
      allocations,
      wastedSpace,
      successRate
    });

    setFeedback(
      allocations.length === vehicleQueue.length
        ? 'All vehicles allocated successfully!'
        : `${allocations.length} vehicle(s) allocated, ${vehicleQueue.length - allocations.length} rejected.`
    );
  };

  const handleReset = () => {
    setSpaces([]);
    setSpaceInput('');
    setVehicleQueue([]);
    setAllocationStrategy('best-fit');
    setResults({ allocations: [], wastedSpace: 0, successRate: 0 });
    setError('');
    setFeedback('');
    parkingLotRef.current = null;
  };

  return (
    <div className="App">
      <h1>Parking Lot Manager</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {feedback && <p className="text-green-500 mb-4">{feedback}</p>}

      <div className="space-y-6">
        {/* Parking Space Configuration */}
        <div>
          <label className="block mb-1 font-medium">
            Parking Space Sizes (e.g., "2 4 6" for Compact, Standard, Large):
          </label>
          <Input
            type="text"
            value={spaceInput}
            onChange={handleSpaceInputChange}
            placeholder="Example: 2 4 6"
            className="w-full"
          />
        </div>

        {/* Vehicle Queue Input */}
        <div>
          <label className="block mb-1 font-medium">Manage Vehicles:</label>
          <div className="flex gap-2 mb-2">
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value as VehicleType)}
              className="border rounded-md px-3 py-2 bg-white text-black"
            >
              {Object.entries(vehicleTypeSizes).map(([type, size]) => (
                <option key={type} value={type}>
                  {type} (Size {size})
                </option>
              ))}
            </select>
            <Button onClick={handleAddVehicle}>Add to Queue</Button>
          </div>
          
          {vehicleQueue.length > 0 && (
            <div className="vehicle-queue mt-2 p-2 bg-gray-100 rounded-md">
              <p className="font-medium">Current Queue:</p>
              <ul className="list-disc pl-5">
                {vehicleQueue.map((size, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span>
                      {Object.keys(vehicleTypeSizes).find(
                        key => vehicleTypeSizes[key as VehicleType] === size
                      )} (Size {size})
                    </span>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveVehicle(index)}
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Strategy Selection */}
        <div>
          <label className="block mb-2 font-medium">Allocation Strategy:</label>
          <div className="flex gap-2">
            {(['best-fit', 'first-fit', 'worst-fit'] as Strategy[]).map((strategy) => (
              <Button
                key={strategy}
                variant={allocationStrategy === strategy ? 'default' : 'outline'}
                onClick={() => setAllocationStrategy(strategy)}
                title={strategyDescriptions[strategy]}
              >
                {strategy.split('-').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </Button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button onClick={handleRunSimulation}>Allocate Vehicles</Button>
          <Button variant="secondary" onClick={handleReset}>
            Reset
          </Button>
        </div>

        {/* Parking Lot Visualization */}
        {spaces.length > 0 && (
          <ParkingLotGrid
            spaces={spaces}
            allocations={results.allocations}
            vehicleSizes={vehicleTypeSizes}
            key={spaces.join('-') + results.allocations.length}
          />
        )}

        {/* Analytics Dashboard */}
        {results.allocations.length > 0 && (
          <div className="analytics-dashboard mt-6 space-y-6">
            <h2 className="text-xl font-semibold">Analytics Dashboard</h2>
            <OccupancyChart 
              spaces={spaces} 
              allocations={results.allocations} 
            />
            <EfficiencyChart successRate={results.successRate} />
            <UsageChart 
              history={[
                vehicleQueue.length, 
                vehicleQueue.length - results.allocations.length
              ]} 
            />
            <p className="mt-2">Total Wasted Space: {results.wastedSpace}</p>
            <p>Success Rate: {results.successRate.toFixed(2)}%</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;