// Classe que representa um Processo

var identifier = 0

const NAME_PROCESS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']

type StatusProcess = 'created' | 'waiting' | 'ready' | 'running' | 'finished'

type StateProcess = {
  status: StatusProcess
  stateChangeWhen: Date //Quando o processo mudou de estado 
}

class Process {
  private id: number
  private name: string

  //Todo: Criar uma event listner para monitorar as mudanças de estado do processo e incrementar dentro de state
  private status: StatusProcess //Estado do processo
  private processType: 'cpu' | 'io' //Tipo de processo
  private waitTime: number //Tempo de espera
  private executionTime: number //Tempo de execução na CPU
  private turnaround: number //Tempo de processamento desde a criação até a finalização
  private createdAt: Date
  private fineshedAt: Date | null

  private states: StateProcess[]

  constructor({ name }: { name: string }) {
    const createdDate = new Date()

    this.id = identifier++
    this.name = name
    this.status = 'created'
    this.waitTime = 0
    this.executionTime = 0
    this.turnaround = 0
    this.fineshedAt = null
    this.createdAt = createdDate

    this.states = [
      {
        status: 'created',
        stateChangeWhen: createdDate
      },
      {
        status: 'waiting',
        stateChangeWhen: new Date()
      }
    ]

    this.status = 'waiting'
    this.processType = Math.random() > 0.5 ? 'cpu' : 'io'
  }

  public end() {
    this.fineshedAt = new Date()
    this.turnaround = (this.fineshedAt.getTime() - this.createdAt.getTime()) + this.waitTime + this.executionTime
    console.log(`
      Processo ${this.name} finalizado.
      Tempo de espera: ${this.waitTime}ms
      Tempo de execução: ${this.executionTime}ms
      Tempo de turnaround: ${this.turnaround}ms  
    `)
  }

  public getNameProcess() {
    return this.name
  }

  public setStatus(status: StatusProcess) {
    this.status = status
    this.states.push({
      status,
      stateChangeWhen: new Date()
    })
  }

  public metadata() {
    return `
      Id: ${this.id}
      Nome do processo: ${this.name}
      Tempo de espera: ${this.waitTime}
      Tempo de execução: ${this.executionTime}
      Tempo de turnaround: ${this.turnaround}
      Criado em: ${this.createdAt}
      Finalizado em: ${this.fineshedAt}
    `
  }
}

type AlocateResource = { 
  miliseconds: number, 
  process: Process, 
  message: string,
  status: StatusProcess 
}

// Classe que implementa o Escalonador FIFO
class FirstInFirstOutScheduler {
  private queue: Process[] = []; // Fila de processos
  private throughput = 0; // Taxa de processamento
  private startIn: Date | null = null; // Início do processamento
  private endIn: Date | null = null; // Fim do processamento

  // Adiciona um processo à fila de pronto
  addProcess(process: Process): void {
    this.queue.push(process);
    console.log(`Processo ${process.getNameProcess()} adicionado à fila.`);
  }

  private async waitingFor({ miliseconds, process, message, status }: AlocateResource): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        process.setStatus(status)
        console.log(`
          [Waiting]: ${miliseconds}ms
          [Process]: ${process.getNameProcess()}
          [Message]: ${message}
        `)
        resolve()
      }, miliseconds)
    })
  }

  private randomTime(): number {
    return (Math.random() + 1) * 1000
  }

  // Executa os processos na ordem de chegada
  async run(): Promise<void> {
    this.startIn = new Date();
    while (this.queue.length > 0) {
      console.log(`---- Running, the list of processes is: ${this.queue.length} ---- \n`);
      const process = this.queue.shift()
      if (process) {
        await this.waitingFor({ miliseconds: this.randomTime(), process, status: 'ready',message: 'Alocando recursos'})
        await this.waitingFor({ miliseconds: this.randomTime(), process, status: 'running',message: 'Executando processo'})
        process.end()
      }
    }

    this.endIn = new Date();

    console.log(`
    --------------------------------------------------------------------
      [Resultado]:
      Todos os processos foram finalizados.
      Início: ${this.startIn}
      Fim: ${this.endIn}
      Total: ${this.endIn?.getTime() - this.startIn?.getTime()}ms
    --------------------------------------------------------------------
    `);
  }
}

// Simulação de escalonamento FIFO
const scheduler = new FirstInFirstOutScheduler();

Array.from({ length: 10 }).forEach((_, i) => {
  scheduler.addProcess(new Process({ name: `"Process ${NAME_PROCESS[i]}"` }));
})

await scheduler.run();
