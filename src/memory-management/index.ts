//Exemplo da classe que representa um processo
class Process {
  private id: number;
  private size: number;
  private position: [number, number] | null; //Posição inicial e final do processo na memória, não deve ser setado no momento da criação, somente no momento de alocação da memória, exemplo: [0, 499]

  constructor(id: number, size: number) {
    this.id = id;
    this.size = size;
    this.position = null;
  }

  setPosition(start: number, end: number) {
    this.position = [start, end];
  }
}

//Exemplo da classe que representa um bloco de memória
class MemoryBlock {
  address: string;
  processId: number | null;
  size: number;
  status: 'free' | 'allocated';
  constructor(address: string, size: number) {
    this.address = address;
    this.size = size;
    this.status = 'free';
    this.processId = null;
  }

  setStatus(status: 'free' | 'allocated') {
    this.status = status;
  }
}

class Memory {
  private blocks: MemoryBlock[];
  private size: number;
  private totalProcessesSize: number;
  private totalFreeMemory: number;
  private totalOccupiedMemory: number;

  constructor(size: number) {
    this.size = size;
    this.blocks = new Array(size);
    this.totalProcessesSize = 0;
    this.totalFreeMemory = size;
    this.totalOccupiedMemory = 0;

    this.createMemoryBlock();
  }

  createHexadecimalAddress(): string {
    return Math.floor(Math.random() * 0x1000000)
      .toString(16)
      .padStart(6, '0');
  }

  private createMemoryBlock() {
    for (let i = 0; i < this.size; i++) {
      this.blocks[i] = new MemoryBlock(this.createHexadecimalAddress(), 1);
    }
  }

  allocateMemory(process: Process) {
    //Todo: Implementar a alocação de memória, detalhado no enunciado do trabalho
  }

  reportMemory() {
    //Todo: Implementar o resultado final do relatório, detalhado no enunciado do trabalho
  }
}

const memory = new Memory(1024);

console.log(memory.createMemoryBlock());
