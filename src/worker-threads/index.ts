import { singleThread } from './single-thread.js';
import { createWorkThread } from './worker-threads.js';

/**
 * Javascript
 */
// singleThread({ message: 'Main thread', limit: 10e6 });
// singleThread({ message: 'Main thread', limit: 10e9 });
// singleThread({ message: 'Main thread', limit: 10e6 });

createWorkThread({ limit: 10e9 }); //limit: 10e4
createWorkThread({ limit: 10e9 }); //limit: 10e5
createWorkThread({ limit: 10e9 }); //limit: 10e5
createWorkThread({ limit: 10e9 }); //limit: 10e5
createWorkThread({ limit: 10e9 }); //limit: 10e5
createWorkThread({ limit: 10e9 }); //limit: 10e5
createWorkThread({ limit: 10e9 }); //limit: 10e5
createWorkThread({ limit: 10e9 }); //limit: 10e5
createWorkThread({ limit: 10e9 }); //limit: 10e5

console.log('Worker threads example started 1.');
console.log('Worker threads example started 2.');
console.log('Worker threads example started 3.');
console.log('Worker threads example started 4.');
console.log('Worker threads example started 5.');
