/**
 * Parking Lot Manager - Parking Lot Grid Component
 * 
 * Displays a visual grid of parking spaces, showing occupancy status (e.g., vehicle type or free)
 * to help managers monitor the lot. Integrates with allocation data from ParkingLot.ts.
 * 
 * @version 0.2.0
 */

import React from 'react';
import { SpaceAllocation } from '../ParkingLot';

interface ParkingLotGridProps {
  spaces: number[];
  allocations: SpaceAllocation[];
  vehicleSizes: Record<string, number>;
}

const vehicleTypes = ['Motorcycle', 'Sedan', 'SUV'];

const ParkingLotGrid: React.FC<ParkingLotGridProps> = ({ spaces, allocations, vehicleSizes }) => {
  /**
   * Determines the status of a space (occupied or free)
   * @param index Space index
   * @returns Status string
   */
  const getSpaceStatus = (index: number) => {
    const allocated = allocations.filter(alloc => alloc.spaceIndex === index);
    if (allocated.length === 0) return `Free (${spaces[index]}/${spaces[index]})`;
    const totalAllocated = allocated.reduce((sum, alloc) => sum + alloc.vehicleSize, 0);
    const vehicles = allocated.map(alloc => {
      return vehicleTypes.find(type => vehicleSizes[type] === alloc.vehicleSize) || 'Unknown';
    });
    return `Occupied: ${vehicles.join(', ')} (${totalAllocated}/${spaces[index]})`;
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold">Parking Lot Status</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {spaces.map((size, index) => (
          <div
            key={index}
            className={`parking-space ${allocations.some(alloc => alloc.spaceIndex === index) ? 'occupied' : 'free'}`}
          >
            <p className="font-medium text-gray-800">Space {index + 1} (Size {size})</p>
            <p className="text-sm text-gray-600">{getSpaceStatus(index)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParkingLotGrid;
