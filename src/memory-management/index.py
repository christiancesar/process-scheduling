import random
from enum import Enum
from json import dumps
from typing import List

from faker import Faker

PROCESS_SIZE = 10
MEMORY_BLOCK_SIZE = 10

identifier = 0

faker = Faker()


class ProcessStatus(Enum):
    ALLOCATED = "allocated"
    NOT_ALLOCATED = "not_allocated"


class Possition:
    def __init__(self, start: str, end: str):
        self.start = start
        self.end = end

    def to_dict(self):
        return {
            "start": self.start,
            "end": self.end,
        }


class Process:
    def __init__(self):
        global identifier
        identifier += 1

        self.id = identifier
        self.status = ProcessStatus.NOT_ALLOCATED
        self.name = faker.file_name(extension="exe")
        self.size = random.randint(1, 100)
        self.original_size = self.size
        self.allocate_size = 0
        self.positions: List[Possition] = []

    def set_position(self, start: str, end: str) -> None:
        self.positions.append(Possition(start, end))

    def to_dict(self):
        return {
            "id": self.id,
            "status": self.status.value,
            "name": self.name,
            "size": self.size,
            "original_size": self.original_size,
            "allocate_size": self.allocate_size,
            "position": [position.to_dict() for position in self.positions],
        }


class Status(Enum):
    FREE = "free"
    ALLOCATED = "allocated"


class MemoryBlock:
    def __init__(self, address: str, size: int):
        self.address = address
        self.size = size
        self.processId = None
        self.status = Status.FREE


class MemoryManagement:
    def __init__(self, size: int):
        self.size = size
        self.blocks = []
        self.processes: List[MemoryBlock] = []
        self.create_memory_block()

    def create_hex_address(self, value: int) -> str:
        return hex(int(value * 1000))

    def create_memory_block(self) -> None:
        for index in range(0, self.size):
            self.blocks.append(MemoryBlock(self.create_hex_address(index + 1), 1))

    # Algoritmos de alocação *First Fit*
    def allocate(self, process: Process) -> None:
        for block in self.blocks:
            if block.status == Status.FREE and process.size > 0:
                block.status = Status.ALLOCATED
                block.processId = process.id

                process.status = ProcessStatus.ALLOCATED
                process.set_position(block.address, block.address)
                process.size -= 1
                process.allocate_size += 1
            else:
                break


memory = MemoryManagement(MEMORY_BLOCK_SIZE)

print("\nCreate memory management\n")
for block in memory.blocks:
    print(block.__dict__)

print("\nCreate processes\n")
processes: List[Process] = []

for process in range(0, PROCESS_SIZE):
    processes.append(Process())

print("\nProcesses created, listing \n")
for process in processes:
    print(process.__dict__)

print("\nAllocating processes\n")
for process in processes:
    memory.allocate(process)

print("\nProcesses allocated in memory \n")
for block in memory.blocks:
    print(block.__dict__)

print("\nListing processes\n")
# for process in processes:
#     print(dumps(process, indent=2))
print(dumps([process.to_dict() for process in processes], indent=2))
