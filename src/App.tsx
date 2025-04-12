/**
 * Parking Lot Simulator - Main Application Component
 * 
 * This React component implements the user interface for a parking lot simulator,
 * allowing users to input parking space and vehicle sizes, select an allocation
 * strategy (best-fit, first-fit, worst-fit), and run a simulation. The logic
 * mirrors memory allocation algorithms taught in operating systems.
 * 
 * @author Sarthak Kulkarni (23101B0019)
 * @author Pulkit Saini (23101B0021)
 * @author Dhruv Tikhande (23101B00005)
 * @version 0.1.0
 */

import React, { ChangeEvent, useState, useRef } from 'react';
import './App.css';
import ParkingLot, { SpaceAllocation } from './ParkingLot';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';

// Define allocation strategy type
type Strategy = 'best-fit' | 'first-fit' | 'worst-fit';

// Descriptions for each strategy
const strategyDescriptions: Record<Strategy, string> = {
  'best-fit': 'Selects the smallest space that fits the vehicle, minimizing wasted space.',
  'first-fit': 'Selects the first space large enough for the vehicle, prioritizing speed.',
  'worst-fit': 'Selects the largest space available, potentially wasting space.',
};

// Project description
const projectDescription = `
  The Parking Lot Simulator is a mini-project for term work, demonstrating memory
  allocation strategies in a parking lot context. Parking spaces represent memory
  blocks, and vehicles represent processes. The best-fit, first-fit, and worst-fit
  strategies are implemented to allocate vehicles to spaces, with results showing
  allocations, wasted space, and success rate.
`;

function App() {
  // State for parking space sizes
  const [spaces, setSpaces] = useState<number[]>([1, 2, 3]);
  // State for vehicle sizes
  const [vehicleSizes, setVehicleSizes] = useState<number[]>([]);
  // State for selected allocation strategy
  const [allocationStrategy, setAllocationStrategy] = useState<Strategy>('best-fit');
  // State for total wasted space after simulation
  const [wastedSpace, setWastedSpace] = useState<number>(0);
  // State for success rate of allocations
  const [successRate, setSuccessRate] = useState<number>(0);
  // State for allocation results
  const [allocations, setAllocations] = useState<SpaceAllocation[]>([]);
  // Reference to ParkingLot instance
  const parkingLotRef = useRef<ParkingLot | null>(null);

  /**
   * Handles changes to parking space sizes input
   * @param event Input change event
   */
  const handleSpaceSizesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const sizes = event.target.value
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map(Number)
      .filter((num) => num > 0 && Number.isInteger(num));
    setSpaces(sizes);
  };

  /**
   * Handles changes to vehicle sizes input
   * @param event Input change event
   */
  const handleVehicleSizesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const sizes = event.target.value
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map(Number)
      .filter((num) => num > 0 && Number.isInteger(num));
    setVehicleSizes(sizes);
  };

  /**
   * Updates the selected allocation strategy
   * @param strategy Selected strategy
   */
  const handleStrategyChange = (strategy: Strategy) => {
    setAllocationStrategy(strategy);
  };

  /**
   * Runs the parking lot simulation
   */
  const handleRunSimulation = () => {
    if (spaces.length === 0 || vehicleSizes.length === 0) {
      alert('Please enter both parking space sizes and vehicle sizes (positive integers).');
      return;
    }

    // Initialize a new ParkingLot instance
    parkingLotRef.current = new ParkingLot({ initialSpaces: [...spaces] });
    const currentAllocations: SpaceAllocation[] = [];
    let parkedCount = 0;

    // Allocate each vehicle
    vehicleSizes.forEach((size) => {
      const allocated = parkingLotRef.current?.allocateSpace(size, allocationStrategy);
      if (allocated && parkingLotRef.current) {
        const lastAllocation = parkingLotRef.current.spaceAllocationsList[
          parkingLotRef.current.spaceAllocationsList.length - 1
        ];
        if (lastAllocation) {
          currentAllocations.push(lastAllocation);
          parkedCount++;
        }
      }
    });

    // Calculate results
    const currentWastedSpace = parkingLotRef.current?.calculateWastedSpace() || 0;
    const currentSuccessRate =
      vehicleSizes.length > 0 ? (parkedCount / vehicleSizes.length) * 100 : 0;

    setWastedSpace(currentWastedSpace);
    setSuccessRate(currentSuccessRate);
    setAllocations(currentAllocations);
  };

  /**
   * Resets the simulation to initial state
   */
  const handleReset = () => {
    setSpaces([]);
    setVehicleSizes([]);
    setWastedSpace(0);
    setSuccessRate(0);
    setAllocations([]);
    parkingLotRef.current = null;
  };

  return (
    <div className="App">
      <h1>Parking Lot Simulator</h1>
      <p>{projectDescription}</p>

      <div className="space-y-6">
        {/* Parking Space Input */}
        <div>
          <label className="block mb-1 font-medium">
            Parking Space Sizes (e.g., 2 4 1):
          </label>
          <Input
            type="text"
            value={spaces.join(' ')}
            onChange={handleSpaceSizesChange}
            placeholder="Example: 2 4 1"
            className="w-full"
          />
        </div>

        {/* Vehicle Sizes Input */}
        <div>
          <label className="block mb-1 font-medium">
            Vehicle Sizes (e.g., 3 1 2):
          </label>
          <Input
            type="text"
            value={vehicleSizes.join(' ')}
            onChange={handleVehicleSizesChange}
            placeholder="Example: 3 1 2"
            className="w-full"
          />
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
          <Button onClick={handleRunSimulation}>Run Simulation</Button>
          <Button variant="secondary" onClick={handleReset}>
            Reset
          </Button>
        </div>

        {/* Simulation Results */}
        {allocations.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold">Simulation Results</h2>
            <div className="grid gap-2 mt-2">
              {allocations.map((allocation, index) => (
                <div key={index} className="bg-gray-100 p-3 rounded-md">
                  Vehicle Size {allocation.vehicleSize} → Space Index{' '}
                  {allocation.spaceIndex}
                </div>
              ))}
            </div>
            <p className="mt-2">Total Wasted Space: {wastedSpace}</p>
            <p>Success Rate: {successRate.toFixed(2)}%</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
