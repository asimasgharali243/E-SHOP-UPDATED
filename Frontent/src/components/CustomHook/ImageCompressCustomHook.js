import CompressorWorker from "../../pages/Dashboard/products/workerImageCompressFormat/imageCompressor.js?worker";

export const useImageCompressor = () => {
  const compressImage = (file) =>
    new Promise((resolve, reject) => {
      const worker = new CompressorWorker();
      worker.postMessage({ file });

      worker.onmessage = (e) => {
        if (e.data.success) {
          try {
            // Reconstruct the file from ArrayBuffer
            const reconstructedFile = new File(
              [e.data.arrayBuffer],
              e.data.fileName,
              { type: e.data.fileType },
              
            );
            resolve(reconstructedFile);
          } catch (error) {
            reject(new Error('Failed to reconstruct compressed file'));
          }
        } else {
          reject(new Error(e.data.error));
        }
        worker.terminate();
      };

      worker.onerror = (error) => {
        reject(error);
        worker.terminate();
      };
    });

  return { compressImage };
};