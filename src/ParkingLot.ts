/**
 * Parking Lot Manager - Allocation Logic
 * 
 * This class implements the core logic for allocating vehicles to parking spaces
 * using best-fit, first-fit, and worst-fit strategies, designed to assist parking
 * managers. It mirrors memory allocation algorithms from operating systems, with
 * spaces representing parking slots and vehicles representing processes.
 * 
 * @author Sarthak Kulkarni (23101B0019)
 * @author Pulkit Saini (23101B0021)
 * @author Dhruv Tikhande (23101B00005)
 * @version 0.2.0
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
  private vehicleEntryTimes: Record<string, { entryTime: Date; exitTime?: Date }> = {};
  private vehicleQueue: string[] = [];

  /**
   * Initializes the parking lot with given space sizes
   * @param param0 Initial spaces configuration (e.g., [2, 4, 6] for Compact, Standard, Large)
   */

  
  constructor({ initialSpaces }: IParkingLot) {
    this.spaces = [...initialSpaces];
    this.spaceAllocations = [];
  }

  /**
   * Allocates a vehicle to a parking space using the specified strategy
   * @param vehicleSize Size of the vehicle (e.g., 1 for Motorcycle, 2 for Sedan)
   * @param strategy Allocation strategy
   * @returns True if allocation succeeds, false otherwise
   */ 
  allocateSpace(vehicleId: string, vehicleSize: number, strategy: 'best-fit' | 'first-fit' | 'worst-fit'): boolean {
    switch (strategy) {
      case 'best-fit':
        return this.allocateBestFit(vehicleId, vehicleSize);
      case 'first-fit':
        return this.allocateFirstFit(vehicleId, vehicleSize);
      case 'worst-fit':
        return this.allocateWorstFit(vehicleId, vehicleSize);
      default:
        if(this.vehicleQueue.length < 5)
        {
          this.vehicleQueue.push(vehicleId)
        }
        return false;
    }
  }

  /**
   * Allocates using best-fit strategy (smallest suitable space)
   * @param vehicleSize Size of the vehicle
   * @returns True if allocated, false otherwise
   */ 
  private allocateBestFit(vehicleId:string, vehicleSize: number): boolean {
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
  private allocateFirstFit(vehicleId:string, vehicleSize: number): boolean {
    const firstFitIndex = this.spaces.findIndex((spaceSize) => spaceSize >= vehicleSize);
    return this.allocate(vehicleId,vehicleSize, firstFitIndex);
  }

  /**
   * Allocates using worst-fit strategy (largest suitable space)
   * @param vehicleSize Size of the vehicle
   * @returns True if allocated, false otherwise
   */
  private allocateWorstFit(vehicleId:string, vehicleSize: number): boolean {
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
   * Performs the actual allocation to a space
   * @param vehicleSize Size of the vehicle
   * @param spaceIndex Index of the space to allocate
   * @returns True if allocated, false otherwise
   */
  private allocate(vehicleId:string, vehicleSize: number, spaceIndex: number): boolean {
    if (spaceIndex !== -1 && this.spaces[spaceIndex] >= vehicleSize) {
      this.vehicleEntryTimes[vehicleId] = { entryTime: new Date() };
      this.spaces[spaceIndex] -= vehicleSize;
      this.spaceAllocations.push({ vehicleSize, spaceIndex });

      return true;
    }
    return false;
  }

  /**
   * Calculates total wasted space (remaining free space)
   * @returns Total wasted space across all spaces
   */
  calculateWastedSpace(): number {
    return this.spaces.reduce((sum, spaceSize) => sum + spaceSize, 0);
  }

  /**
   * Gets the list of allocations for display
   * @returns Array of allocation records
   */
  get spaceAllocationsList(): SpaceAllocation[] {
    return [...this.spaceAllocations];
  }

  /**
   * Calculates the time taken by a vehicle to park in the lot
   * @param vehicleId Id of the vehicle
   * @returns Time taken by the vehicle in milliseconds
   */
  calculateTimeTaken(vehicleId: string): number | null {
    const vehicleTimes = this.vehicleEntryTimes[vehicleId];
    if (!vehicleTimes || !vehicleTimes.exitTime) {
      return null; // Vehicle not found or still in the lot
    }
    return vehicleTimes.exitTime.getTime() - vehicleTimes.entryTime.getTime();
  }
  
   get getQueue(): string[] {
    return [...this.vehicleQueue];
  }

  
}