import React, { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { Button } from '../components/ui/button';

type VehicleType = 'Motorcycle' | 'Sedan' | 'SUV';

interface VehicleQueueManagerProps {
  vehicleType: VehicleType;
  setVehicleType: Dispatch<SetStateAction<VehicleType>>;
  vehicleQueue: number[];
  handleAddVehicle: () => void;
  handleRemoveVehicle: (index: number) => void;
  vehicleTypeSizes: Record<VehicleType, number>;
}

const VehicleQueueManager: React.FC<VehicleQueueManagerProps> = ({
  vehicleType,
  setVehicleType,
  vehicleQueue,
  handleAddVehicle,
  handleRemoveVehicle,
  vehicleTypeSizes,
}) => {
  return (
    <div>
      <label className="block mb-1 font-medium">Manage Vehicles:</label>
      <div className="flex gap-2 mb-2">
        <select
          value={vehicleType}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => setVehicleType(e.target.value as VehicleType)}
          className="vehicle-select"
        >
          {Object.entries(vehicleTypeSizes).map(([type, size]) => (
            <option key={type} value={type}>
              {type} (Size {size})
            </option>
          ))}
        </select>
        <Button className="vehicle-button" onClick={handleAddVehicle}>Add to Queue</Button>
      </div>

      {vehicleQueue.length > 0 && (
        <div className="vehicle-queue mt-2 p-2 bg-gray-100 rounded-md">
          <p className="font-medium">Current Queue:</p>
          <ul className="list-disc pl-5">
            {vehicleQueue.map((size, index) => (
              <li key={index} className="flex justify-between items-center">
                <span>
                  {Object.keys(vehicleTypeSizes).find(
                    (key) => vehicleTypeSizes[key as VehicleType] === size
                  )}{' '}
                  (Size {size})
                </span>
                <Button
                  className="vehicle-button destructive"
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
  );
};

export default VehicleQueueManager;
