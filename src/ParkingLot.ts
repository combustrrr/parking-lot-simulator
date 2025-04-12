/**
 * Parking Lot Simulator - Allocation Logic
 * 
 * This class implements the core logic for the Parking Lot Simulator, handling
 * vehicle allocation to parking spaces using best-fit, first-fit, and worst-fit
 * strategies. It mirrors memory allocation algorithms from operating systems.
 * 
 * @author Sarthak Kulkarni (23101B0019)
 * @author Pulkit Saini (23101B0021)
 * @author Dhruv Tikhande (23101B00005)
 * @version 0.1.0
 */

export interface SpaceAllocation {
  vehicleSize: number;
  spaceIndex: number;
}

interface IParkingLot {
  initialSpaces: number[];
}

export default class ParkingLot {
  private spaces: number[];
  private spaceAllocations: SpaceAllocation[];
  private vehiclesParked: number;

  /**
   * Initializes the parking lot with given space sizes
   * @param param0 Initial spaces configuration
   */
  constructor({ initialSpaces }: IParkingLot) {
    this.spaces = [...initialSpaces];
    this.spaceAllocations = [];
    this.vehiclesParked = 0;
  }

  /**
   * Allocates a vehicle to a parking space using the specified strategy
   * @param vehicleSize Size of the vehicle
   * @param strategy Allocation strategy
   * @returns True if allocation succeeds, false otherwise
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
  }

  /**
   * Allocates using best-fit strategy (smallest suitable space)
   * @param vehicleSize Size of the vehicle
   * @returns True if allocated, false otherwise
   */
  private allocateBestFit(vehicleSize: number): boolean {
    let bestFitIndex = -1;
    let minWaste = Infinity;

    this.spaces.forEach((spaceSize, index) => {
      if (spaceSize >= vehicleSize && spaceSize - vehicleSize < minWaste) {
        bestFitIndex = index;
        minWaste = spaceSize - vehicleSize;
      }
    });

    return this.allocate(vehicleSize, bestFitIndex);
  }

  /**
   * Allocates using first-fit strategy (first suitable space)
   * @param vehicleSize Size of the vehicle
   * @returns True if allocated, false otherwise
   */
  private allocateFirstFit(vehicleSize: number): boolean {
    const firstFitIndex = this.spaces.findIndex((spaceSize) => spaceSize >= vehicleSize);
    return this.allocate(vehicleSize, firstFitIndex);
  }

  /**
   * Allocates using worst-fit strategy (largest suitable space)
   * @param vehicleSize Size of the vehicle
   * @returns True if allocated, false otherwise
   */
  private allocateWorstFit(vehicleSize: number): boolean {
    let worstFitIndex = -1;
    let maxWaste = -1;

    this.spaces.forEach((spaceSize, index) => {
      if (spaceSize >= vehicleSize && spaceSize - vehicleSize > maxWaste) {
        worstFitIndex = index;
        maxWaste = spaceSize - vehicleSize;
      }
    });

    return this.allocate(vehicleSize, worstFitIndex);
  }

  /**
   * Performs the actual allocation
   * @param vehicleSize Size of the vehicle
   * @param spaceIndex Index of the space to allocate
   * @returns True if allocated, false otherwise
   */
  private allocate(vehicleSize: number, spaceIndex: number): boolean {
    if (spaceIndex !== -1 && this.spaces[spaceIndex] >= vehicleSize) {
      this.spaces[spaceIndex] -= vehicleSize;
      this.spaceAllocations.push({ vehicleSize, spaceIndex });
      this.vehiclesParked += 1;
      return true;
    }
    return false;
  }

  /**
   * Calculates total wasted space (remaining space after allocations)
   * @returns Total wasted space
   */
  calculateWastedSpace(): number {
    return this.spaces.reduce((sum, spaceSize) => sum + spaceSize, 0);
  }

  /**
   * Gets the list of allocations
   * @returns Array of allocations
   */
  get spaceAllocationsList(): SpaceAllocation[] {
    return [...this.spaceAllocations];
  }
}
