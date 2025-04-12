import React from 'react';
import { Button } from '../components/ui/button';

interface ActionButtonsProps {
  handleRunSimulation: () => void;
  handleReset: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ handleRunSimulation, handleReset }) => {
  return (
    <div className="flex gap-2">
      <Button onClick={handleRunSimulation}>Allocate Vehicles</Button>
      <Button variant="secondary" onClick={handleReset}>
        Reset
      </Button>
    </div>
  );
};

export default ActionButtons;