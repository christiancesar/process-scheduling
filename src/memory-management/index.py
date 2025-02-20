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
    __name: str
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

    def to_dict(self):
        return {
            "address": self.address,
            "size": self.size,
            "processId": self.processId,
            "status": self.status.value,
        }


class MemoryManagement:
    def __init__(self, size: int):
        self.size = size
        self.blocks: List[MemoryBlock] = []
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

    def to_dict(self):
        return {
            "size": self.size,
            "blocks": [block.to_dict() for block in self.blocks],
        }


memory = MemoryManagement(MEMORY_BLOCK_SIZE)

print("\nCreating memory management\n")

print(dumps(memory.to_dict(), indent=2))

print("\nCreating processes\n")
processes: List[Process] = []

for process in range(0, PROCESS_SIZE):
    processes.append(Process())

print(dumps([process.to_dict() for process in processes], indent=2))

print("\nAllocating processes\n")
for process in processes:
    memory.allocate(process)

print("\nListing processes allocated in memory \n")
print(dumps(memory.to_dict(), indent=2))

print("\nListing processes\n")

print(dumps([process.to_dict() for process in processes], indent=2))

# Create memory management

# {'address': '0x3e8', 'size': 1, 'processId': None, 'status': <Status.FREE: 'free'>}
# {'address': '0x7d0', 'size': 1, 'processId': None, 'status': <Status.FREE: 'free'>}
# {'address': '0xbb8', 'size': 1, 'processId': None, 'status': <Status.FREE: 'free'>}
# {'address': '0xfa0', 'size': 1, 'processId': None, 'status': <Status.FREE: 'free'>}
# {'address': '0x1388', 'size': 1, 'processId': None, 'status': <Status.FREE: 'free'>}
# {'address': '0x1770', 'size': 1, 'processId': None, 'status': <Status.FREE: 'free'>}
# {'address': '0x1b58', 'size': 1, 'processId': None, 'status': <Status.FREE: 'free'>}
# {'address': '0x1f40', 'size': 1, 'processId': None, 'status': <Status.FREE: 'free'>}
# {'address': '0x2328', 'size': 1, 'processId': None, 'status': <Status.FREE: 'free'>}
# {'address': '0x2710', 'size': 1, 'processId': None, 'status': <Status.FREE: 'free'>}

# Create processes


# Processes created, listing

# {'id': 1, 'status': <ProcessStatus.NOT_ALLOCATED: 'not_allocated'>, 'name': 'threat.exe', 'size': 7, 'original_size': 7, 'allocate_size': 0, 'positions': []}
# {'id': 2, 'status': <ProcessStatus.NOT_ALLOCATED: 'not_allocated'>, 'name': 'low.exe', 'size': 64, 'original_size': 64, 'allocate_size': 0, 'positions': []}
# {'id': 3, 'status': <ProcessStatus.NOT_ALLOCATED: 'not_allocated'>, 'name': 'clear.exe', 'size': 63, 'original_size': 63, 'allocate_size': 0, 'positions': []}
# {'id': 4, 'status': <ProcessStatus.NOT_ALLOCATED: 'not_allocated'>, 'name': 'reduce.exe', 'size': 49, 'original_size': 49, 'allocate_size': 0, 'positions': []}
# {'id': 5, 'status': <ProcessStatus.NOT_ALLOCATED: 'not_allocated'>, 'name': 'step.exe', 'size': 93, 'original_size': 93, 'allocate_size': 0, 'positions': []}
# {'id': 6, 'status': <ProcessStatus.NOT_ALLOCATED: 'not_allocated'>, 'name': 'leg.exe', 'size': 58, 'original_size': 58, 'allocate_size': 0, 'positions': []}
# {'id': 7, 'status': <ProcessStatus.NOT_ALLOCATED: 'not_allocated'>, 'name': 'particularly.exe', 'size': 34, 'original_size': 34, 'allocate_size': 0, 'positions': []}
# {'id': 8, 'status': <ProcessStatus.NOT_ALLOCATED: 'not_allocated'>, 'name': 'thank.exe', 'size': 89, 'original_size': 89, 'allocate_size': 0, 'positions': []}
# {'id': 9, 'status': <ProcessStatus.NOT_ALLOCATED: 'not_allocated'>, 'name': 'current.exe', 'size': 31, 'original_size': 31, 'allocate_size': 0, 'positions': []}
# {'id': 10, 'status': <ProcessStatus.NOT_ALLOCATED: 'not_allocated'>, 'name': 'if.exe', 'size': 53, 'original_size': 53, 'allocate_size': 0, 'positions': []}

# Allocating processes


# Processes allocated in memory

# {'address': '0x3e8', 'size': 1, 'processId': 1, 'status': <Status.ALLOCATED: 'allocated'>}
# {'address': '0x7d0', 'size': 1, 'processId': 1, 'status': <Status.ALLOCATED: 'allocated'>}
# {'address': '0xbb8', 'size': 1, 'processId': 1, 'status': <Status.ALLOCATED: 'allocated'>}
# {'address': '0xfa0', 'size': 1, 'processId': 1, 'status': <Status.ALLOCATED: 'allocated'>}
# {'address': '0x1388', 'size': 1, 'processId': 1, 'status': <Status.ALLOCATED: 'allocated'>}
# {'address': '0x1770', 'size': 1, 'processId': 1, 'status': <Status.ALLOCATED: 'allocated'>}
# {'address': '0x1b58', 'size': 1, 'processId': 1, 'status': <Status.ALLOCATED: 'allocated'>}
# {'address': '0x1f40', 'size': 1, 'processId': None, 'status': <Status.FREE: 'free'>}
# {'address': '0x2328', 'size': 1, 'processId': None, 'status': <Status.FREE: 'free'>}
# {'address': '0x2710', 'size': 1, 'processId': None, 'status': <Status.FREE: 'free'>}

# Listing processes

# [
#   {
#     "id": 1,
#     "status": "allocated",
#     "name": "threat.exe",
#     "size": 0,
#     "original_size": 7,
#     "allocate_size": 7,
#     "position": [
#       {
#         "start": "0x3e8",
#         "end": "0x3e8"
#       },
#       {
#         "start": "0x7d0",
#         "end": "0x7d0"
#       },
#       {
#         "start": "0xbb8",
#         "end": "0xbb8"
#       },
#       {
#         "start": "0xfa0",
#         "end": "0xfa0"
#       },
#       {
#         "start": "0x1388",
#         "end": "0x1388"
#       },
#       {
#         "start": "0x1770",
#         "end": "0x1770"
#       },
#       {
#         "start": "0x1b58",
#         "end": "0x1b58"
#       }
#     ]
#   },
#   {
#     "id": 2,
#     "status": "not_allocated",
#     "name": "low.exe",
#     "size": 64,
#     "original_size": 64,
#     "allocate_size": 0,
#     "position": []
#   },
#   {
#     "id": 3,
#     "status": "not_allocated",
#     "name": "clear.exe",
#     "size": 63,
#     "original_size": 63,
#     "allocate_size": 0,
#     "position": []
#   },
#   {
#     "id": 4,
#     "status": "not_allocated",
#     "name": "reduce.exe",
#     "size": 49,
#     "original_size": 49,
#     "allocate_size": 0,
#     "position": []
#   },
#   {
#     "id": 5,
#     "status": "not_allocated",
#     "name": "step.exe",
#     "size": 93,
#     "original_size": 93,
#     "allocate_size": 0,
#     "position": []
#   },
#   {
#     "id": 6,
#     "status": "not_allocated",
#     "name": "leg.exe",
#     "size": 58,
#     "original_size": 58,
#     "allocate_size": 0,
#     "position": []
#   },
#   {
#     "id": 7,
#     "status": "not_allocated",
#     "name": "particularly.exe",
#     "size": 34,
#     "original_size": 34,
#     "allocate_size": 0,
#     "position": []
#   },
#   {
#     "id": 8,
#     "status": "not_allocated",
#     "name": "thank.exe",
#     "size": 89,
#     "original_size": 89,
#     "allocate_size": 0,
#     "position": []
#   },
#   {
#     "id": 9,
#     "status": "not_allocated",
#     "name": "current.exe",
#     "size": 31,
#     "original_size": 31,
#     "allocate_size": 0,
#     "position": []
#   },
#   {
#     "id": 10,
#     "status": "not_allocated",
#     "name": "if.exe",
#     "size": 53,
#     "original_size": 53,
#     "allocate_size": 0,
#     "position": []
#   }
# ]
