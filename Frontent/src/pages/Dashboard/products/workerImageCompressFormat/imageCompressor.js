import imageCompression from "browser-image-compression";
import { removeBackground, preload } from "@imgly/background-removal";

const COMPRESSION_CONFIG = {
  maxSizeMB: 0.2,
  maxWidthOrHeight: 1200,
  useWebWorker: true,
  fileType: "image/webp",
  initialQuality: 0.9,
  alwaysKeepResolution: true,
};

const BG_REMOVAL_CONFIG = {
  model: "isnet_fp16",
  publicPath: `${self.location.origin}/`,
  debug: true,
  proxyToWorker: true,
  output: { format: "image/webp", quality: 0.85 },
};

let modelLoaded = false;
let modelPromise = null;

async function ensureModelLoaded() {
  if (modelLoaded) return true;
  if (!modelPromise) {
    modelPromise = preload(BG_REMOVAL_CONFIG)
      .then(() => (modelLoaded = true))
      .catch((err) => {
        modelPromise = null;
        throw err;
      });
  }
  return modelPromise;
}

async function runCompression(file, onProgress) {
  return await imageCompression(file, {
    ...COMPRESSION_CONFIG,
    onProgress: (p) => onProgress(Math.round(p), "compression"),
  });
}

async function runBgRemoval(file, onProgress) {
  await ensureModelLoaded();
  const result = await removeBackground(file, {
    ...BG_REMOVAL_CONFIG,
    progress: (_, current, total) =>
      onProgress(Math.round((current / total) * 100), "bg-removal"),
  });
  if (result.size < 1024) throw new Error("Invalid BG removal output");
  return result;
}

self.onmessage = async ({ data }) => {
  const { file, bg, onlyBg, preload: isPreload, taskId } = data;

  if (isPreload) {
    try {
      await ensureModelLoaded();
      self.postMessage({ type: "preload-complete", taskId });
    } catch (err) {
      self.postMessage({ type: "preload-failed", error: err.message, taskId });
    }
    return;
  }

  try {
    const onProgress = (progress, stage) => {
      const totalStages = bg && !onlyBg ? 2 : 1;
      const stageIndex = stage === "compression" ? 0 : 1;
      const scaled =
        ((stageIndex + progress / 100) / totalStages) * 100;
      self.postMessage({
        type: "progress",
        progress: Math.min(100, Math.round(scaled)),
        stage,
        taskId,
      });
    };

    let processedFile;
    if (onlyBg) {
      processedFile = await runBgRemoval(file, onProgress);
    } else {
      const compressed = await runCompression(file, onProgress);
      processedFile = bg
        ? await runBgRemoval(compressed, onProgress)
        : compressed;
    }

    const arrayBuffer = await processedFile.arrayBuffer();
    self.postMessage({
      type: "complete",
      arrayBuffer,
      fileName: file.name.replace(/\.[^/.]+$/, "") + ".webp",
      fileType: "image/webp",
      originalSize: file.size,
      processedSize: processedFile.size,
      taskId,
    });
  } catch (err) {
    self.postMessage({
      type: "error",
      error: err.message,
      stack: err.stack,
      taskId,
    });
  }
};
