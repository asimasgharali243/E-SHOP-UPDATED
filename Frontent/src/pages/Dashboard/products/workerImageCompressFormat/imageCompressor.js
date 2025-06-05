import imageCompression from 'browser-image-compression';

self.onmessage = async function (e) {
  const { file } = e.data;

  try {
    const options = {
          maxSizeMB: 0.5,             // Reasonable size (~500KB)
      maxWidthOrHeight: 1600,     // High clarity for upscaled use
      useWebWorker: true,         // Speed boost
      fileType: 'image/webp',
      initialQuality: 0.8,        // Balanced start point
      alwaysKeepResolution: true,
    };

    //     const options = {
    //   maxSizeMB: 0.2, // aggressively compress to ~200 KB
    //   maxWidthOrHeight: 1024,
    //   useWebWorker: true,
    //   alwaysKeepResolution: true,
    // };

    const compressedFile = await imageCompression(file, options);
    
    // Convert to ArrayBuffer for reliable transfer
    const arrayBuffer = await compressedFile.arrayBuffer();
    
    self.postMessage({ 
      success: true, 
      arrayBuffer,
      fileName: compressedFile.name,
      fileType: compressedFile.type,
      
    });
  } catch (error) {
    self.postMessage({ 
      success: false, 
      error: error.message 
    });
  }
};