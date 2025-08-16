import { useEffect, useRef, useCallback } from "react";
import CompressorWorker from "../../pages/Dashboard/products/workerImageCompressFormat/imageCompressor.js?worker";

export const useImageCompressor = () => {
  const workerRef = useRef(null);
  const taskCallbacks = useRef(new Map());

  // Initialize worker once
  useEffect(() => {
    const worker = new CompressorWorker();
    workerRef.current = worker;

    const handleMessage = (e) => {
      const { type, taskId, ...data } = e.data;
      const callbacks = taskCallbacks.current.get(taskId);
      if (!callbacks) return;

      switch (type) {
        case "progress":
          callbacks.onProgress?.(data.progress, data.stage);
          break;
        case "complete":
          callbacks.onComplete?.(data);
          taskCallbacks.current.delete(taskId);
          break;
        case "error":
          callbacks.onError?.(data.error, data.stack);
          taskCallbacks.current.delete(taskId);
          break;
        case "preload-complete":
          callbacks.onPreloadComplete?.();
          break;
        case "preload-failed":
          callbacks.onPreloadError?.(data.error);
          break;
      }
    };

    worker.addEventListener("message", handleMessage);

    // Preload ML model
    worker.postMessage({ preload: true, taskId: crypto.randomUUID() });

    return () => {
      worker.removeEventListener("message", handleMessage);
      worker.terminate();
    };
  }, []);

  const compressImage = useCallback((file, options = {}, callbacks = {}) => {
    return new Promise((resolve, reject) => {
      if (!workerRef.current) {
        return reject(new Error("Worker not initialized"));
      }

      const taskId = crypto.randomUUID();
      const { bg = false, onlyBg = false } = options;

      taskCallbacks.current.set(taskId, {
        onProgress: callbacks.onProgress,
        onComplete: (result) => {
          const processedFile = new File(
            [result.arrayBuffer],
            result.fileName,
            { type: result.fileType }
          );
          resolve({
            file: processedFile,
            originalSize: result.originalSize,
            processedSize: result.processedSize,
            reduction: (
              ((result.originalSize - result.processedSize) /
                result.originalSize) *
              100
            ).toFixed(1),
          });
        },
        onError: (error) => reject(new Error(error)),
      });

      workerRef.current.postMessage({ file, bg, onlyBg, taskId });
    });
  }, []);

  return { compressImage };
};
