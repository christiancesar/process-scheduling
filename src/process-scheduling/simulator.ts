import { faker } from '@faker-js/faker';
import { FirstInFirstOutScheduler } from './first-in-first-out-scheduler.js';
import { Process } from './process.js';

export class Simulator {
  private scheduler: FirstInFirstOutScheduler;
  private simulationProcessCount: number;

  constructor(simulationProcessCount?: number) {
    this.scheduler = new FirstInFirstOutScheduler();
    this.simulationProcessCount = simulationProcessCount || 10;
  }

  async run() {
    Array.from({ length: this.simulationProcessCount }).forEach(() => {
      this.scheduler.addProcess(
        new Process({
          name: `${faker.system.fileName({ extensionCount: 1 })}`,
        }),
      );
    });

    await this.scheduler.run();
  }
}
