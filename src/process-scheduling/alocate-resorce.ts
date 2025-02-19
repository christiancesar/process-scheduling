import { Process, StatusProcess } from './process.js';

export type AlocateResource = {
  miliseconds: number;
  process: Process;
  message: string;
  status?: StatusProcess;
};
