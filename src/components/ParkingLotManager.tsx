import React from 'react';

interface ParkingLotManagerProps {
  spaces: number;
  spaceInput: string;
  vehicleQueue: string[];
  allocationStrategy: string;
  results: string[];
  error: string | null;
  feedback: string | null;
  handleSpaceInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddVehicle: () => void;
  handleRemoveVehicle: () => void;
  handleRunSimulation: () => void;
  handleReset: () => void;
}

const ParkingLotManager: React.FC<ParkingLotManagerProps> = ({
  spaces,
  spaceInput,
  vehicleQueue,
  allocationStrategy,
  results,
  error,
  feedback,
  handleSpaceInputChange,
  handleAddVehicle,
  handleRemoveVehicle,
  handleRunSimulation,
  handleReset,
}) => {
  return (
    <div>
      <div>
        <label htmlFor="spaces">Spaces:</label>
        <input
          type="number"
          id="spaces"
          value={spaceInput}
          onChange={handleSpaceInputChange}
        />
        <p>Total Spaces: {spaces}</p>
      </div>
      <div>
        <label htmlFor="vehicleQueue">Vehicle Queue:</label>
        <input
          type="text"
          id="vehicleQueue"
          placeholder="Enter vehicle IDs (comma-separated)"
          value={vehicleQueue.join(',')}
          readOnly
        />
        <button onClick={handleAddVehicle}>Add Vehicle</button>
        <button onClick={handleRemoveVehicle}>Remove Vehicle</button>
      </div>
      <div>
        <p>Allocation Strategy: {allocationStrategy}</p>
      </div>
      <div>
        <h2>Results</h2>
        <ul>
          {results.map((result, index) => (
            <li key={index}>{result}</li>
          ))}
        </ul>
        {error && <p className="error">{error}</p>}
        {feedback && <p className="feedback">{feedback}</p>}
      </div>
      <div>
        <button onClick={handleRunSimulation}>Run Simulation</button>
        <button onClick={handleReset}>Reset</button>
      </div>
    </div>
  );
};

export default ParkingLotManager;