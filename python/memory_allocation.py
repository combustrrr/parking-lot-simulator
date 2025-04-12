"""
Parking Lot Simulator - Memory Allocation (Python)

This script implements memory allocation strategies (best-fit, first-fit, worst-fit)
as part of the term work experiment, serving as a reference for the React-based
Parking Lot Simulator. Memory blocks are analogous to parking spaces, and processes
are analogous to vehicles.

@author Sarthak Kulkarni (23101B0019)
@author Pulkit Saini (23101B0021)
@author Dhruv Tikhande (23101B00005)
@version 0.1.0
"""

from typing import List, Tuple
from dataclasses import dataclass

@dataclass
class Allocation:
    """Represents a single allocation of a process to a memory block."""
    process_size: int
    block_index: int

class MemoryAllocator:
    """Handles memory allocation using different strategies."""
    
    def __init__(self, block_sizes: List[int]):
        """
        Initialize the allocator with memory block sizes.
        
        Args:
            block_sizes: List of memory block sizes
        """
        self.blocks = block_sizes.copy()
        self.allocations: List[Allocation] = []
        self.processes_allocated = 0
    
    def allocate(self, process_size: int, strategy: str) -> bool:
        """
        Allocate a process using the specified strategy.
        
        Args:
            process_size: Size of the process
            strategy: Allocation strategy ('best-fit', 'first-fit', 'worst-fit')
        
        Returns:
            bool: True if allocation succeeds, False otherwise
        """
        if strategy == 'best-fit':
            return self.allocate_best_fit(process_size)
        elif strategy == 'first-fit':
            return self.allocate_first_fit(process_size)
        elif strategy == 'worst-fit':
            return self.allocate_worst_fit(process_size)
        return False
    
    def allocate_best_fit(self, process_size: int) -> bool:
        """
        Allocate using best-fit strategy (smallest suitable block).
        
        Args:
            process_size: Size of the process
        
        Returns:
            bool: True if allocated, False otherwise
        """
        best_index = -1
        min_waste = float('inf')
        
        for i, block_size in enumerate(self.blocks):
            if block_size >= process_size and block_size - process_size < min_waste:
                best_index = i
                min_waste = block_size - process_size
        
        return self._allocate(process_size, best_index)
    
    def allocate_first_fit(self, process_size: int) -> bool:
        """
        Allocate using first-fit strategy (first suitable block).
        
        Args:
            process_size: Size of the process
        
        Returns:
            bool: True if allocated, False otherwise
        """
        for i, block_size in enumerate(self.blocks):
            if block_size >= process_size:
                return self._allocate(process_size, i)
        return False
    
    def allocate_worst_fit(self, process_size: int) -> bool:
        """
        Allocate using worst-fit strategy (largest suitable block).
        
        Args:
            process_size: Size of the process
        
        Returns:
            bool: True if allocated, False otherwise
        """
        worst_index = -1
        max_waste = -1
        
        for i, block_size in enumerate(self.blocks):
            if block_size >= process_size and block_size - process_size > max_waste:
                worst_index = i
                max_waste = block_size - process_size
        
        return self._allocate(process_size, worst_index)
    
    def _allocate(self, process_size: int, block_index: int) -> bool:
        """
        Perform the actual allocation.
        
        Args:
            process_size: Size of the process
            block_index: Index of the block to allocate
        
        Returns:
            bool: True if allocated, False otherwise
        """
        if block_index != -1 and self.blocks[block_index] >= process_size:
            self.blocks[block_index] -= process_size
            self.allocations.append(Allocation(process_size, block_index))
            self.processes_allocated += 1
            return True
        return False
    
    def calculate_wasted_space(self) -> int:
        """
        Calculate total wasted space (remaining block sizes).
        
        Returns:
            int: Total wasted space
        """
        return sum(self.blocks)
    
    def get_success_rate(self, total_processes: int) -> float:
        """
        Calculate allocation success rate.
        
        Args:
            total_processes: Total number of processes attempted
        
        Returns:
            float: Success rate as a percentage
        """
        return (self.processes_allocated / total_processes * 100) if total_processes > 0 else 0

def run_simulation(block_sizes: List[int], process_sizes: List[int], strategy: str) -> Tuple[List[Allocation], int, float]:
    """
    Run a memory allocation simulation.
    
    Args:
        block_sizes: List of memory block sizes
        process_sizes: List of process sizes
        strategy: Allocation strategy
    
    Returns:
        Tuple containing allocations, wasted space, and success rate
    """
    allocator = MemoryAllocator(block_sizes)
    allocations = []
    
    for size in process_sizes:
        if allocator.allocate(size, strategy):
            allocations.append(allocator.allocations[-1])
    
    wasted_space = allocator.calculate_wasted_space()
    success_rate = allocator.get_success_rate(len(process_sizes))
    
    return allocations, wasted_space, success_rate

def main():
    """Example usage of the memory allocator."""
    block_sizes = [100, 500, 200, 300, 600]
    process_sizes = [212, 417, 112, 426]
    strategies = ['best-fit', 'first-fit', 'worst-fit']
    
    for strategy in strategies:
        print(f"
Running {strategy} allocation:")
        allocations, wasted_space, success_rate = run_simulation(block_sizes, process_sizes, strategy)
        
        print("Allocations:")
        for alloc in allocations:
            print(f"  Process {alloc.process_size} -> Block {alloc.block_index}")
        print(f"Wasted Space: {wasted_space}")
        print(f"Success Rate: {success_rate:.2f}%")

if __name__ == "__main__":
    main()
