import url from 'node:url';
import {
  isMainThread,
  parentPort,
  threadId,
  Worker,
  workerData,
} from 'node:worker_threads';
import { singleThread } from './single-thread.js';

const __filename = url.fileURLToPath(import.meta.url);
// console.log(__filename);

type WorkerThreadData = {
  limit?: number;
};

export function createWorkThread(params?: WorkerThreadData) {
  if (isMainThread) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(__filename, {
        workerData: { limit: params?.limit },
      });
      worker.on('message', resolve);
      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });
    });
  }
}

if (!isMainThread) {
  try {
    const { limit } = workerData as WorkerThreadData;
    singleThread({ limit, message: `Worker thread ${threadId}` });

    parentPort?.postMessage(`Worker thread ${threadId} finished`);
  } catch (error) {
    console.error('Error:', error);
  }
}
