import { singleThread } from './single-thread.js';
import { createWorkThread } from './worker-threads.js';

/**
 * Javascript
 */
singleThread({ message: 'Main thread' });

console.log(await createWorkThread()); //limit: 10e4
console.log(await createWorkThread({ limit: 10e5 })); //limit: 10e5
