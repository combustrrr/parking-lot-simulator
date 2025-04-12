
export interface SpaceAllocation {
  vehicleSize: number;
  spaceIndex: number;
}

interface IParkingLot {
  initialSpaces: number[];
}

class ParkingLot {
  spaces: number[];
  spaceAllocations: SpaceAllocation[];
  vehiclesParked: number;
  totalWastedSpace: number;
    
  /**
   * Constructor of the class ParkingLot. It is in charge of initialising the values.
   * @param initialSpaces Array that contains the size of the initial spaces.
   */
  totalVehicles: number;
  constructor({ initialSpaces }: IParkingLot) {
    this.spaces = [...initialSpaces];
    this.spaceAllocations = [];
    this.vehiclesParked = 0;
    this.totalWastedSpace = 0;
    this.totalVehicles = 0;
  }

    /**
     * This method is in charge of selecting the right algorithm.
     * @param vehicleSize size of the vehicle.
     * @param strategy strategy to apply.
     * @returns
     */
  allocateSpace(vehicleSize: number, strategy: 'best-fit' | 'first-fit' | 'worst-fit'): boolean {
    switch (strategy) {
      case 'best-fit':
        return this.allocateBestFit(vehicleSize);
      case 'first-fit':
        return this.allocateFirstFit(vehicleSize);
      case 'worst-fit':
        return this.allocateWorstFit(vehicleSize);
      default:
        return false;
    }
  };

    /**
     * This method will find the best possible fit.
     * @param vehicleSize size of the vehicle.
     * @returns
     */
  allocateBestFit(vehicleSize: number): boolean {
    let bestFitIndex = -1;
    let minWaste = Infinity;
    const spaces = this.spaces;
    spaces.forEach((spaceSize, index) => {
      if (spaceSize >= vehicleSize && spaceSize - vehicleSize < minWaste) {
        bestFitIndex = index;
        minWaste = spaceSize - vehicleSize;
      }
    });

    return this._allocate(vehicleSize, bestFitIndex);
  };

    /**
     * This method will find the first possible fit.
     * @param vehicleSize size of the vehicle.
     * @returns
     */
  allocateFirstFit(vehicleSize: number): boolean {
    const firstFitIndex = this.spaces.findIndex(spaceSize => spaceSize >= vehicleSize);
    return this._allocate(vehicleSize, firstFitIndex);
  };

    /**
     * This method will find the worst possible fit.
     * @param vehicleSize size of the vehicle.
     * @returns
     */
  allocateWorstFit(vehicleSize: number): boolean {
    let worstFitIndex = -1;
    let maxWaste = -1;
    
    this.spaces.forEach((spaceSize, index) => {
      if (spaceSize >= vehicleSize && spaceSize - vehicleSize > maxWaste) {
        worstFitIndex = index;
        maxWaste = spaceSize - vehicleSize;
      }
    });

    return this._allocate(vehicleSize, worstFitIndex);
  };
    /**
     * This method is used to actually allocate the space. It will update the space value, the allocation array and the parked vehicles counter.
     * @param vehicleSize
     * @param spaceIndex
     * @returns
     * @private
     */
  _allocate(vehicleSize: number, spaceIndex: number): boolean {
    if (spaceIndex !== -1 && this.spaces[spaceIndex] >= vehicleSize) {
      const updatedSpaces = [...this.spaces];
      updatedSpaces[spaceIndex] -= vehicleSize;
      this.spaces = updatedSpaces;
      this.spaceAllocations = [...this.spaceAllocations, { vehicleSize, spaceIndex }];
      this.vehiclesParked = this.vehiclesParked + 1;
      return true;
    }
    return false;
  };

    /**
     * This method will calculate the wasted space.
     * @returns
     */
  calculateWastedSpace(): number {
    const wastedSpace = this.spaces.reduce((sum, spaceSize) => sum + spaceSize, 0);
    this.totalWastedSpace = wastedSpace;
    return wastedSpace;
  };
    
    /**
     * This method will calculate the success rate of the allocations.
     * @param vehicleSizes
     * @returns
     */  
  getSuccessRate(vehicleSizes: number[]): number {
    this.totalVehicles = vehicleSizes.length;
    return vehicleSizes.length > 0 ? (this.vehiclesParked / vehicleSizes.length) * 100 : 0;
  };
    
  get spaceAllocationsList() : SpaceAllocation[] {
    return this.spaceAllocations;
  }

    /**
     * Setter of the totalWastedSpace.
     * @param totalWastedSpace
     */
  set totalWastedSpaceSetter(totalWastedSpace:number) {
      this.totalWastedSpace = totalWastedSpace;
  }
    
    /**
     * Setter of the totalVehicles.
     * @param totalVehicles
     */
  set totalVehiclesSetter(totalVehicles:number) {
      this.totalVehicles = totalVehicles;
  }
}

export default ParkingLot;