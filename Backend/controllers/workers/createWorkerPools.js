import Piscina from 'piscina';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


 function createWorkerPool({ workerFile, maxThreads, minThreads = 1 }) {
  if (!workerFile) {
    throw new Error('workerFile is required to create a Piscina pool');
  }

  const cpuCount = os.cpus().length;
  const isLowResourceDevice = cpuCount <= 2;

  const resolvedMaxThreads = typeof maxThreads === 'number'
    ? Math.max(1, maxThreads)
    : (isLowResourceDevice ? 2 : Math.max(cpuCount - 1, 1));

  return new Piscina({
    filename: path.resolve(__dirname, workerFile),
    minThreads,
    maxThreads: resolvedMaxThreads,
    idleTimeout: 10000, 
    concurrentTasksPerWorker: 1, 
    useAtomics: true 
  
  });
}
 const AuthWorkerPool = createWorkerPool({ workerFile: './Authworker/authWorker.js', maxThreads: 2 });
export default AuthWorkerPool