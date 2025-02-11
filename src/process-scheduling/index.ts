import { faker } from '@faker-js/faker';
import { Temporal } from '@js-temporal/polyfill';

let identifier = 0;

type StatusProcess = 'created' | 'waiting' | 'ready' | 'running' | 'finished';

type StateProcess = {
  status: StatusProcess;
  stateChangeWhen: Date; //Quando o processo mudou de estado
};

class Process {
  private id: number;
  private name: string;

  //Todo: Criar uma event listner para monitorar as mudanças de estado do processo e incrementar dentro de state
  private currentStatus: StatusProcess; //Estado do processo
  private processType: 'CPU' | 'I/O'; //Tipo de processo
  private createdTime: number; //Tempo de criação
  private waitTime: number; //Tempo de espera
  private runningTime: number; //Tempo de execução na CPU
  private readyTime: number; //Tempo de pronto na CPU
  private turnaround: number; //Tempo de processamento desde a criação até a finalização
  private createdAt: Date;
  private fineshedAt: Date | null;

  private states: StateProcess[];

  constructor({ name }: { name: string }) {
    const createdDate = new Date();

    this.id = identifier++;
    this.name = name;
    this.currentStatus = 'created';
    this.createdTime = 0;
    this.waitTime = 0;
    this.runningTime = 0;
    this.turnaround = 0;
    this.readyTime = 0;
    this.fineshedAt = null;
    this.createdAt = createdDate;

    this.states = [
      {
        status: 'created',
        stateChangeWhen: createdDate,
      },
      {
        status: 'waiting',
        stateChangeWhen: new Date(),
      },
    ];

    this.currentStatus = 'waiting';
    this.processType = Math.random() > 0.5 ? 'CPU' : 'I/O';
  }

  public end() {
    console.log(`Processo finalizado, mostrando informações:`);
    this.setStatus('finished');

    const waitStart = this.states.find(
      (state) => state.status === 'waiting',
    )?.stateChangeWhen;
    const readyStart = this.states.find(
      (state) => state.status === 'ready',
    )?.stateChangeWhen;
    const runningStart = this.states.find(
      (state) => state.status === 'running',
    )?.stateChangeWhen;
    const finished = this.states.find(
      (state) => state.status === 'finished',
    )?.stateChangeWhen;

    if (waitStart) {
      this.createdTime = waitStart.getTime() - this.createdAt.getTime();
    }

    if (waitStart && readyStart) {
      this.waitTime = readyStart.getTime() - waitStart.getTime();
    }

    if (readyStart && runningStart) {
      this.readyTime = runningStart.getTime() - readyStart.getTime();
    }

    if (runningStart && finished) {
      this.runningTime = finished.getTime() - runningStart.getTime();
    }

    if (finished) {
      this.fineshedAt = finished;
    }

    this.turnaround = this.waitTime + this.readyTime + this.runningTime;

    console.log(this.metadata());
  }

  public getNameProcess() {
    return this.name;
  }

  public setStatus(status: StatusProcess) {
    this.currentStatus = status;
    this.states.push({
      status,
      stateChangeWhen: new Date(),
    });
  }

  private getDurationFormatted(time: number): string {
    return `${Temporal.Duration.from({ milliseconds: time }).total({ unit: 'seconds' }).toFixed(5)}s`;
  }

  private getStatesFormatted() {
    return this.states.map(
      (state, index) =>
        `\n\t[#${index + 1}][${state.status}]: ${state.stateChangeWhen}`,
    );
  }

  public metadata() {
    return `
      Id: ${this.id}
      Nome do processo: ${this.name}
      Tipo do processo: ${this.processType}
      Status atual: ${this.currentStatus}
      Tempo de criação: ${this.getDurationFormatted(this.createdTime)}
      Tempo de espera: ${this.getDurationFormatted(this.waitTime)}
      Tempo de pronto: ${this.getDurationFormatted(this.readyTime)}
      Tempo de execução: ${this.getDurationFormatted(this.runningTime)}
      Tempo de turnaround: ${this.getDurationFormatted(this.turnaround)}
      Criado em: ${this.createdAt}
      Finalizado em: ${this.fineshedAt}

      Estados:
      ${this.getStatesFormatted()}
    `;
  }
}

type AlocateResource = {
  miliseconds: number;
  process: Process;
  message: string;
  status?: StatusProcess;
};

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

  private async waitingFor({
    miliseconds,
    process,
    message,
    status,
  }: AlocateResource): Promise<void> {
    if (status) {
      process.setStatus(status);
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`
          [Waiting]: ${miliseconds}ms
          [Process]: ${process.getNameProcess()}
          [Message]: ${message}
        `);

        resolve();
      }, miliseconds);
    });
  }

  private randomTime(): number {
    return Math.round((Math.random() + 1) * 1000);
  }

  // Executa os processos na ordem de chegada
  async run(): Promise<void> {
    this.startIn = new Date();
    while (this.queue.length > 0) {
      console.log(
        `\n\n---- Running, the list of processes is: ${this.queue.length} ---- \n`,
      );
      const process = this.queue.shift();
      if (process) {
        await this.waitingFor({
          miliseconds: this.randomTime(),
          process,
          status: 'ready',
          message: 'Alocando recursos',
        });
        await this.waitingFor({
          miliseconds: this.randomTime(),
          process,
          status: 'running',
          message: 'Executando processo',
        });
        process.end();
      }
    }

    this.endIn = new Date();
    const totalTime = this.endIn?.getTime() - this.startIn?.getTime();

    console.log(`
    --------------------------------------------------------------------
    [Resultado final]:
      Todos os processos foram finalizados.
      Início da execução: ${this.startIn}
      Fim da execução: ${this.endIn}
      Total gasto: ${Temporal.Duration.from({ milliseconds: totalTime }).total({ unit: 'seconds' }).toFixed(5)}s
    --------------------------------------------------------------------
    `);
  }
}

// Simulação de escalonamento FIFO
const scheduler = new FirstInFirstOutScheduler();

Array.from({ length: 1 }).forEach(() => {
  scheduler.addProcess(
    new Process({ name: `${faker.system.fileName({ extensionCount: 1 })}` }),
  );
});

await scheduler.run();
