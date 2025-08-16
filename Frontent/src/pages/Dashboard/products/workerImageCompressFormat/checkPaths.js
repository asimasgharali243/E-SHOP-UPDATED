// checkPaths.js
async function checkPath(url) {
  try {
    const res = await fetch(url, { method: "HEAD" });
    if (res.ok) {
      console.log(`✅ Found: ${url}`);
      return true;
    } else {
      console.error(`❌ Not found (HTTP ${res.status}): ${url}`);
      return false;
    }
  } catch (err) {
    console.error(`❌ Error loading ${url}:`, err);
    return false;
  }
}

export async function verifyLocalFiles() {
  const runtimePath = "/runtime/ort-wasm.wasm";
  const modelPath = "/models/isnet_fp16";

  console.log("🔍 Checking runtime & model files...");
  const runtimeOk = await checkPath(runtimePath);
  const modelOk = await checkPath(modelPath);

  if (runtimeOk && modelOk) {
    console.log("✅ All required files found! You can run preload().");
  } else {
    console.error("❌ Missing one or more files. Check your public/ folder paths.");
  }
}
