import React, { ChangeEvent, useState, useRef } from 'react';
import './App.css';
import ParkingLot, { SpaceAllocation } from './ParkingLot';
import ParkingLotConfig from './components/ParkingLotConfig';
import VehicleQueueManager from './components/VehicleQueueManager';
import StrategySelector from './components/StrategySelector';
import ActionButtons from './components/ActionButtons';
import ParkingLotGrid from './components/ParkingLotGrid';
import OccupancyChart from './components/OccupancyChart';
import EfficiencyChart from './components/EfficiencyChart';
import UsageChart from './components/UsageChart';
import { Chart as ChartJS, Filler } from 'chart.js/auto';
import ParkingLotManager from './components/ParkingLotManager';

type Strategy = 'best-fit' | 'first-fit' | 'worst-fit';
type VehicleType = 'Motorcycle' | 'Sedan' | 'SUV';

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

ChartJS.register(Filler)

export default function App() {
  const [spaces, setSpaces] = useState<number[]>([]);
  const [spaceInput, setSpaceInput] = useState<string>('');
  const [vehicleType, setVehicleType] = useState<VehicleType>('Sedan');
  const [vehicleQueue, setVehicleQueue] = useState<number[]>([]);
  const [allocationStrategy, setAllocationStrategy] = useState<Strategy>('best-fit');
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const parkingLotRef = useRef<ParkingLot | null>(null);
  const [results, setResults] = useState<{
    allocations: SpaceAllocation[];
    wastedSpace: number;
    successRate: number;
  }>({ allocations: [], wastedSpace: 0, successRate: 0 });

  const [parkedVehicles, setParkedVehicles] = useState<number[]>([]);

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

    parkingLotRef.current = new ParkingLot({ initialSpaces: spaces });
    const allocations: SpaceAllocation[] = [];
    const successfullyParked: number[] = [];

    vehicleQueue.forEach(size => {
      const allocated = parkingLotRef.current?.allocateSpace(
        Math.random().toString(),
        size,
        allocationStrategy
      );
      if (allocated && parkingLotRef.current) {
        allocations.push(parkingLotRef.current.spaceAllocationsList[parkingLotRef.current.spaceAllocationsList.length - 1]);
        successfullyParked.push(size);
      }
    });

    const wastedSpace = parkingLotRef.current?.calculateWastedSpace() || 0;
    const successRate = vehicleQueue.length > 0 ? (allocations.length / vehicleQueue.length) * 100 : 0;

    setResults({
      allocations,
      wastedSpace,
      successRate
    });

    setParkedVehicles(successfullyParked);

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
    setParkedVehicles([]);
  };

  return (
    <div className="App">
      <h1>Parking Lot Manager</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {feedback && <p className="text-green-500 mb-4">{feedback}</p>}

      <div className="space-y-6">
          <ParkingLotConfig
            spaceInput={spaceInput}
            handleSpaceInputChange={handleSpaceInputChange}
          />
          <VehicleQueueManager
            vehicleType={vehicleType}
            setVehicleType={setVehicleType}
            vehicleQueue={vehicleQueue}
            handleAddVehicle={handleAddVehicle}
            handleRemoveVehicle={handleRemoveVehicle}
            vehicleTypeSizes={vehicleTypeSizes}
          />
          <StrategySelector allocationStrategy={allocationStrategy} setAllocationStrategy={setAllocationStrategy} strategyDescriptions={strategyDescriptions}/>
          <ActionButtons handleRunSimulation={handleRunSimulation} handleReset={handleReset}/>

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
              history={parkedVehicles}
            />
            <p className="mt-2">Total Wasted Space: {results.wastedSpace}</p>
            <p>Success Rate: {results.successRate.toFixed(2)}%</p>
          </div>
        )}
      </div>
    </div>
  );
}
