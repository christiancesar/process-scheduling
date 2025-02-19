import { Temporal } from '@js-temporal/polyfill';
import { Process, StatusProcess } from './process.js';

type AlocateResource = {
  miliseconds: number;
  process: Process;
  message: string;
  status?: StatusProcess;
};

// Classe que implementa o Escalonador FIFO
export class FirstInFirstOutScheduler {
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
