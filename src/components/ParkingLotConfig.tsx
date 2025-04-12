import React from 'react';
import { Input } from '../components/ui/input';

interface ParkingLotConfigProps {
  spaceInput: string;
  handleSpaceInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ParkingLotConfig: React.FC<ParkingLotConfigProps> = ({ spaceInput, handleSpaceInputChange }) => {
  return (
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
  );
};

export default ParkingLotConfig;