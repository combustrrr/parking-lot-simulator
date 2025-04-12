/**
 * Parking Lot Manager - Main Application Component
 * 
 * This React component implements a web interface for parking lot managers to
 * allocate vehicles to spaces using memory allocation strategies (best-fit, first-fit,
 * worst-fit). It features a dynamic vehicle queue, parking grid, and charts to monitor
 * occupancy, efficiency, and queue status, designed for term work to demonstrate
 * operating system concepts in a real-world-inspired context.
 * 
 * @author Sarthak Kulkarni (23101B0019)
 * @author Pulkit Saini (23101B0021)
 * @author Dhruv Tikhande (23101B00005)
 * @version 0.2.1
 */

import React, { ChangeEvent, useState, useRef, useEffect, useCallback } from 'react';
import './App.css';
import ParkingLot, { SpaceAllocation } from './ParkingLot';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';
import ParkingLotGrid from './components/ParkingLotGrid';
import OccupancyChart from './components/OccupancyChart';
import EfficiencyChart from './components/EfficiencyChart';
import UsageChart from './components/UsageChart';

// Define allocation strategy type
export type Strategy = 'best-fit' | 'first-fit' | 'worst-fit';

// Define vehicle types and their sizes
type VehicleType = 'Motorcycle' | 'Sedan' | 'SUV';
const vehicleSizes: Record<VehicleType, number> = {
  Motorcycle: 1,
  Sedan: 2,
  SUV: 3,
};

// Descriptions for each strategy
const strategyDescriptions: Record<Strategy, string> = {
  'best-fit': 'Allocates to the smallest space that fits, optimizing space usage.',
  'first-fit': 'Uses the first space large enough, for quick allocation.',
  'worst-fit': 'Chooses the largest space, reducing fragmentation.',
};

// Project description
const projectDescription = `
  The Parking Lot Manager is a mini-project for term work, assisting parking managers
  in allocating vehicles to spaces using memory allocation strategies. It provides a
  dashboard with a parking grid and charts to visualize occupancy, efficiency, and
  queue status, bridging operating system concepts with practical parking management.
`;

function App() {
  // State for parking space sizes (e.g., Compact=2, Standard=4, Large=6)
  const [spaces, setSpaces] = useState<number[]>([]);
  // State for space input string (comma-separated)
  const [spaceInput, setSpaceInput] = useState<string>('');
  // State for selected vehicle type to add
  const [vehicleType, setVehicleType] = useState<VehicleType>('Sedan');
  // State for queued vehicles awaiting allocation
  const [vehicleQueue, setVehicleQueue] = useState<number[]>([]);
  // State for rejected vehicles (no space available)
  const [rejectedVehicles, setRejectedVehicles] = useState<number[]>([]);
  // State for selected allocation strategy
  const [allocationStrategy, setAllocationStrategy] = useState<Strategy>('best-fit');
  // State for allocation results
  const [allocations, setAllocations] = useState<SpaceAllocation[]>([]);
  // State for input errors
  const [error, setError] = useState<string>('');
  // Reference to ParkingLot instance
  const parkingLotRef = useRef<ParkingLot | null>(null);

  // Debounce logic
  const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  /**
   * Handles changes to parking space sizes input
   */
  const handleSpaceSizesChange = useCallback(() => {
    if (!spaceInput.trim()) {
      setSpaces([]);
      setError('');
      setAllocations([]);
      parkingLotRef.current = null;
      return;
    }

    const sizes = spaceInput
      .split(',')
      .map((s) => Number(s.trim()))
      .filter((num) => !isNaN(num));

    if (
      sizes.length !== spaceInput.split(',').filter((s) => s.trim() !== '').length ||
      sizes.some((num) => num <= 0 || !Number.isInteger(num))
    ) {
      setError('Space sizes must be positive integers (e.g., 2,4,6).');
      return;
    }

    setSpaces(sizes);
    setError('');
    setAllocations([]);
    parkingLotRef.current = null;
  }, [spaceInput]);

  const debouncedHandleSpaceSizesChange = useCallback(
    debounce(handleSpaceSizesChange, 1000),
    [handleSpaceSizesChange]
  );

  useEffect(() => {
    debouncedHandleSpaceSizesChange();
  }, [spaceInput, debouncedHandleSpaceSizesChange]);

  /**
   * Updates space input
   */
  const handleSpaceInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSpaceInput(event.target.value);
  };

  /**
   * Updates the selected vehicle type
   */
  const handleVehicleTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setVehicleType(event.target.value as VehicleType);
  };

  /**
   * Adds a vehicle to the queue
   */
  const handleAddVehicle = () => {
    const size = vehicleSizes[vehicleType];
    setVehicleQueue([...vehicleQueue, size]);
    setError('');
  };

  /**
   * Removes a vehicle from the queue (simulates exit)
   */
  const handleRemoveVehicle = (index: number) => {
    const newQueue = [...vehicleQueue];
    newQueue.splice(index, 1);
    setVehicleQueue(newQueue);
  };

  /**
   * Updates the selected allocation strategy
   */
  const handleStrategyChange = (strategy: Strategy) => {
    setAllocationStrategy(strategy);
  };

  /**
   * Allocates a single vehicle
   */
  const allocateVehicle = (vehicleSize: number) => {
    if (!parkingLotRef.current) {
      parkingLotRef.current = new ParkingLot({ initialSpaces: [...spaces] });
    }

    const parkedVehicle = parkingLotRef.current.allocateSpace(
      vehicleSize,
      allocationStrategy
    );

    if (parkedVehicle) {
      const lastAllocation =
        parkingLotRef.current.spaceAllocationsList[
          parkingLotRef.current.spaceAllocationsList.length - 1
        ];
      if (lastAllocation) {
        setAllocations([...allocations, lastAllocation]);
      }
    } else {
      setRejectedVehicles([...rejectedVehicles, vehicleSize]);
    }
  };

  /**
   * Deallocates a vehicle from a space
   */
  const handleDeallocateVehicle = (allocationIndex: number) => {
    if (!parkingLotRef.current) return;

    const allocation = allocations[allocationIndex];
    parkingLotRef.current.deallocateSpace(allocation.spaceIndex, allocation.vehicleSize);
    const newAllocations = allocations.filter((_, i) => i !== allocationIndex);
    setAllocations(newAllocations);
  };

  /**
   * Runs the allocation for queued vehicles
   */
  const handleRunSimulation = () => {
    if (spaces.length === 0) {
      setError('Please enter parking space sizes.');
      return;
    }
    if (vehicleQueue.length === 0) {
      setError('Please add at least one vehicle to the queue.');
      return;
    }

    const newQueue = [...vehicleQueue];
    newQueue.forEach((size) => allocateVehicle(size));
    setVehicleQueue([]);
    setError('');
  };

  /**
   * Resets the simulation to initial state
   */
  const handleReset = () => {
    setSpaces([]);
    setSpaceInput('');
    setVehicleType('Sedan');
    setVehicleQueue([]);
    setRejectedVehicles([]);
    setAllocationStrategy('best-fit');
    setAllocations([]);
    setError('');
    parkingLotRef.current = null;
  };

  /**
   * Calculates metrics for charts
   */
  const getMetrics = () => {
    const wastedSpace = parkingLotRef.current?.calculateWastedSpace() || 0;
    const totalVehicles = vehicleQueue.length + allocations.length + rejectedVehicles.length;
    const successRate = totalVehicles > 0 ? (allocations.length / totalVehicles) * 100 : 0;
    return { wastedSpace, successRate };
  };

  return (
    <div className="App">
      <h1>Parking Lot Manager</h1>
      <p>{projectDescription}</p>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="space-y-6">
        {/* Parking Space Configuration */}
        <div>
          <label className="block mb-1 font-medium">
            Parking Space Sizes (e.g., 2,4,6 for Compact, Standard, Large):
          </label>
          <Input
            type="text"
            value={spaceInput}
            onChange={handleSpaceInputChange}
            placeholder="Enter sizes (e.g., 2,4,4,6)"
            className="w-full bg-white text-black"
          />
        </div>

        {/* Vehicle Queue Input */}
        <div>
          <label className="block mb-1 font-medium">Manage Vehicles:</label>
          <div className="flex gap-2 mb-2">
            <select
              value={vehicleType}
              onChange={handleVehicleTypeChange}
              className="border rounded-md px-3 py-2 bg-white text-black"
            >
              <option value="Motorcycle">Motorcycle (Size 1)</option>
              <option value="Sedan">Sedan (Size 2)</option>
              <option value="SUV">SUV (Size 3)</option>
            </select>
            <Button onClick={handleAddVehicle}>Add to Queue</Button>
          </div>
          {vehicleQueue.length > 0 && (
            <div className="vehicle-queue mt-2 p-2">
              <p className="font-medium">Current Queue:</p>
              <ul className="list-disc pl-5">
                {vehicleQueue.map((size, index) => {
                  const vehicleName = Object.keys(vehicleSizes).find(
                    (key) => vehicleSizes[key as VehicleType] === size
                  );
                  return (
                    <li key={index} className="flex justify-between items-center">
                      <span>{vehicleName} (Size {size})</span>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveVehicle(index)}
                      >
                        Remove
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          {rejectedVehicles.length > 0 && (
            <div className="mt-2 p-2 bg-red-100 rounded-md">
              <p className="font-medium text-red-700">Rejected (No Space):</p>
              <ul className="list-disc pl-5 text-red-700">
                {rejectedVehicles.map((size, index) => {
                  const vehicleName = Object.keys(vehicleSizes).find(
                    (key) => vehicleSizes[key as VehicleType] === size
                  );
                  return (
                    <li key={index}>{vehicleName} (Size {size})</li>
                  );
                })}
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
                onClick={() => handleStrategyChange(strategy)}
                title={strategyDescriptions[strategy]}
              >
                {strategy
                  .split('-')
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')}
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
            allocations={allocations}
            vehicleSizes={vehicleSizes}
          />
        )}

        {/* Allocated Vehicles */}
        {allocations.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold">Allocated Vehicles</h2>
            <ul className="list-disc pl-5 mt-2">
              {allocations.map((alloc, index) => {
                const vehicleName = Object.keys(vehicleSizes).find(
                  (key) => vehicleSizes[key as VehicleType] === alloc.vehicleSize
                );
                return (
                  <li key={index} className="flex justify-between items-center">
                    <span>
                      {vehicleName} (Size {alloc.vehicleSize}) in Space {alloc.spaceIndex + 1}
                    </span>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeallocateVehicle(index)}
                    >
                      Deallocate
                    </Button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Analytics Dashboard */}
        {(allocations.length > 0 || rejectedVehicles.length > 0) && (
          <div className="analytics-dashboard mt-6 space-y-6">
            <h2 className="text-xl font-semibold">Analytics Dashboard</h2>
            <OccupancyChart spaces={spaces} allocations={allocations} />
            <EfficiencyChart successRate={getMetrics().successRate} />
            <UsageChart history={[vehicleQueue.length, rejectedVehicles.length]} />
            <p className="mt-2">Total Wasted Space: {getMetrics().wastedSpace}</p>
            <p>Success Rate: {getMetrics().successRate.toFixed(2)}%</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;