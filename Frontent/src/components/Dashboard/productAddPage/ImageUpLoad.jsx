import React, { useState, useRef, useEffect, useCallback } from "react";
import { FormCheck, Spinner, Button } from "react-bootstrap";
import { useImageCompressor } from "../../CustomHook/ImageCompressCustomHook";

export default function ImageUpload({ MAX_IMAGES = 5, images, setImages }) {
  const fileInputRef = useRef();
  const { compressImage } = useImageCompressor();

  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [removeBackgroundForAll, setRemoveBackgroundForAll] = useState(false);
  const [removeBackgroundPerImage, setRemoveBackgroundPerImage] = useState([]);
  const [progressData, setProgressData] = useState({});
  const [isProcessing, setIsProcessing] = useState({});
  const processingQueue = useRef(new Set());
  const prevImagesRef = useRef([]);

  const hasImages = images.length > 0;
  const canAddMore = images.length < MAX_IMAGES;

  // Cleanup unused blob URLs
  useEffect(() => {
    const prev = prevImagesRef.current;
    const currentUrls = new Set(images.map((img) => img.previewUrl));
    prev.forEach((img) => {
      if (!currentUrls.has(img.previewUrl)) URL.revokeObjectURL(img.previewUrl);
    });
    prevImagesRef.current = images;
  }, [images]);

  const formatBytes = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const updateProgress = useCallback((index, progress, stage) => {
    setProgressData((prev) => ({ ...prev, [index]: { progress, stage } }));
  }, []);

  const setProcessingState = useCallback((index, status) => {
    setIsProcessing((prev) => ({ ...prev, [index]: status }));
  }, []);

  const processImage = useCallback(
    async (file, index, forceRemoveBg = null) => {
      const shouldRemoveBg =
        forceRemoveBg ??
        (removeBackgroundForAll || removeBackgroundPerImage[index]);

      const existing = images[index];
      if (existing?.processed && existing.removeBg === shouldRemoveBg) {
        // Already processed with same settings — skip
        return null;
      }
      if (processingQueue.current.has(index)) return null;

      processingQueue.current.add(index);
      setProcessingState(index, true);
      updateProgress(
        index,
        0,
        shouldRemoveBg ? "background-removal" : "compression"
      );

      try {
        const result = await compressImage(
          file,
          { bg: shouldRemoveBg },
          { onProgress: (p, s) => updateProgress(index, p, s) }
        );

        return {
          file: result.file,
          previewUrl: URL.createObjectURL(result.file),
          originalName: file.name,
          processed: true,
          removeBg: shouldRemoveBg,
          originalSize: result.originalSize,
          processedSize: result.processedSize,
          reduction: result.reduction,
        };
      } catch (error) {
        console.error("Processing failed:", error);
        return {
          file,
          previewUrl: URL.createObjectURL(file),
          originalName: file.name,
          processed: false,
          removeBg: shouldRemoveBg,
        };
      } finally {
        processingQueue.current.delete(index);
        setProcessingState(index, false);
        updateProgress(index, 100, null);
      }
    },
    [
      compressImage,
      images,
      removeBackgroundForAll,
      removeBackgroundPerImage,
      updateProgress,
    ]
  );

  const handleFilesAdded = useCallback(
    async (files) => {
      const fileList = Array.from(files).slice(0, MAX_IMAGES - images.length);
      if (!fileList.length) return;

      const startIndex = images.length;
      const newFlags = Array(fileList.length).fill(removeBackgroundForAll);
      const newImages = [];

      const concurrencyLimit = 3;
      for (let i = 0; i < fileList.length; i += concurrencyLimit) {
        const batch = fileList.slice(i, i + concurrencyLimit);
        const results = await Promise.allSettled(
          batch.map((file, idx) => processImage(file, startIndex + i + idx))
        );
        results.forEach(
          (r) => r.status === "fulfilled" && r.value && newImages.push(r.value)
        );
      }

      setImages((prev) => [...prev, ...newImages]);
      setRemoveBackgroundPerImage((prev) => [...prev, ...newFlags]);
    },
    [images.length, MAX_IMAGES, processImage, removeBackgroundForAll]
  );

  const reprocessImage = useCallback(
    async (index) => {
      const updated = await processImage(
        images[index].file,
        index,
        removeBackgroundPerImage[index]
      );
      if (updated) {
        setImages((prev) =>
          prev.map((img, i) => (i === index ? updated : img))
        );
      }
    },
    [images, processImage, removeBackgroundPerImage]
  );

  const removeImage = useCallback(
    (index) => {
      setImages((prev) => {
        const copy = [...prev];
        const [removed] = copy.splice(index, 1);
        if (removed) URL.revokeObjectURL(removed.previewUrl);
        return copy;
      });
      setRemoveBackgroundPerImage((prev) => {
        const copy = [...prev];
        copy.splice(index, 1);
        return copy;
      });
      if (mainImageIndex >= images.length - 1) setMainImageIndex(0);
    },
    [images.length, mainImageIndex]
  );

  const toggleRemoveBgAll = useCallback(
    async (e) => {
      const value = e.target.checked;
      setRemoveBackgroundForAll(value);
      setRemoveBackgroundPerImage(Array(images.length).fill(value));

      for (let i = 0; i < images.length; i++) {
        // Only reprocess if current state differs from target state
        if (!images[i]?.processed || images[i].removeBg !== value) {
          await reprocessImage(i);
        }
      }
    },
    [images, reprocessImage]
  );

  useEffect(() => {
    if (hasImages && !isProcessing[mainImageIndex]) {
      reprocessImage(mainImageIndex);
    }
  }, [mainImageIndex]);

  const handleImageError = useCallback((e) => {
    e.target.src = "/fallback-image.jpg";
    e.target.onerror = null;
  }, []);

  // NEW: Clear All
  const clearAllImages = useCallback(() => {
    images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    setImages([]);
    setRemoveBackgroundPerImage([]);
    setProgressData({});
    setIsProcessing({});
    setMainImageIndex(0);
  }, [images]);

  // UPDATED: Reprocess All — skip already processed
  const reprocessAllImages = useCallback(async () => {
    for (let i = 0; i < images.length; i++) {
      if (
        !images[i]?.processed ||
        images[i].removeBg !== removeBackgroundPerImage[i]
      ) {
        await reprocessImage(i);
      }
    }
  }, [images, removeBackgroundPerImage, reprocessImage]);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files?.length && canAddMore) {
          handleFilesAdded(e.dataTransfer.files);
        }
      }}
    >
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          if (e.target.files?.length) {
            handleFilesAdded(e.target.files);
            e.target.value = "";
          }
        }}
      />

      <div
        className="bg-white p-3 rounded shadow-sm text-center"
        style={{ minHeight: 500 }}
      >
        {hasImages && (
          <div className="d-flex justify-content-between align-items-center mb-3  gap-2">
            <FormCheck
              label="Remove bg (All)"
              checked={removeBackgroundForAll}
              onChange={toggleRemoveBgAll}
            />
            <div className="d-flex gap-2 justify-content-start">
              <Button
                variant="outline-primary"
                size="sm"
                onClick={reprocessAllImages}
                disabled={images.length === 0}
              >
                Reprocess All
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={clearAllImages}
                disabled={images.length === 0}
                className="ms-2 d-flex align-items-center justify-content-end"
              >
                Clear All
              </Button>
            </div>
          </div>
        )}

        {/* Existing UI remains unchanged */}
        {hasImages ? (
          <>
            {/* Main Image */}
            <div className="position-relative mb-3">
              <img
                src={images[mainImageIndex].previewUrl}
                alt="Main"
                onError={handleImageError}
                className="img-fluid"
                style={{
                  height: 300,
                  objectFit: "contain",
                  borderRadius: 8,
                  cursor: "pointer",
                  opacity: isProcessing[mainImageIndex] ? 0.5 : 1,
                }}
              />
              {isProcessing[mainImageIndex] && (
                <div className="position-absolute top-50 start-50 translate-middle">
                  <Spinner animation="border" variant="primary" />
                </div>
              )}
              {images[mainImageIndex]?.processed && (
                <div className="mt-2 text-muted small d-flex justify-content-between">
                  <div>
                    Original: {formatBytes(images[mainImageIndex].originalSize)}
                  </div>
                  <div>
                    Compressed:{" "}
                    {formatBytes(images[mainImageIndex].processedSize)} |
                  </div>
                  <div>Reduction: {images[mainImageIndex].reduction}%</div>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="d-flex flex-wrap gap-2 justify-content-center">
              {images.map(
                (img, idx) =>
                  idx !== mainImageIndex && (
                    <div
                      key={idx}
                      className="position-relative"
                      style={{ width: 100, height: 100 }}
                    >
                      <img
                        src={img.previewUrl}
                        alt={`thumb-${idx}`}
                        onError={handleImageError}
                        onClick={() => setMainImageIndex(idx)}
                        style={{
                          width: 100,
                          height: 100,
                          objectFit: "cover",
                          borderRadius: 8,
                          opacity: isProcessing[idx] ? 0.5 : 1,
                          cursor: "pointer",
                        }}
                      />
                      {isProcessing[idx] && (
                        <div className="position-absolute top-50 start-50 translate-middle">
                          <Spinner
                            animation="border"
                            variant="primary"
                            size="sm"
                          />
                        </div>
                      )}
                      <button
                        type="button"
                        className="btn-close position-absolute top-0 end-0 m-1"
                        style={{ backgroundColor: "rgba(255,255,255,0.7)" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(idx);
                        }}
                      />
                    </div>
                  )
              )}
              {canAddMore && (
                <div
                  className="d-flex justify-content-center align-items-center border border-secondary rounded"
                  style={{ width: 100, height: 100, cursor: "pointer" }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <i className="bi bi-plus-circle fs-3 text-primary"></i>
                </div>
              )}
            </div>

            {/* Per-image controls */}
            <div className="mt-4 bg-light p-3 rounded">
              <h5>Background Removal Settings</h5>
              {images.map((img, i) => (
                <div
                  key={i}
                  className="d-flex align-items-center  justify-content-between flex-wrap gap-1 mt-2 "
                >
                  <span>
                    {" "}
                    {img.originalName?.length > 10
                      ? img.originalName.slice(0, 10) + "..."
                      : img.originalName || "Untitled"}
                  </span>
                  <FormCheck
                    checked={removeBackgroundPerImage[i] || false}
                    disabled={removeBackgroundForAll}
                    onChange={(e) => {
                      const copy = [...removeBackgroundPerImage];
                      copy[i] = e.target.checked;
                      setRemoveBackgroundPerImage(copy);
                      reprocessImage(i);
                    }}
                  />
                  <button
                    className="btn btn-sm btn-outline-primary ms-auto"
                    disabled={removeBackgroundForAll || isProcessing[i]}
                    onClick={() => reprocessImage(i)}
                  >
                    {isProcessing[i] ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          className="me-1"
                        />
                        Processing
                      </>
                    ) : (
                      "Reprocess"
                    )}
                  </button>
                  {isProcessing[i] && progressData[i] && (
                    <div style={{ width: 100 }}>
                      <div className="progress" style={{ height: 5 }}>
                        <div
                          className={`progress-bar progress-bar-striped progress-bar-animated ${
                            progressData[i].stage === "background-removal"
                              ? "bg-success"
                              : "bg-primary"
                          }`}
                          style={{ width: `${progressData[i].progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="d-flex flex-column justify-content-center align-items-center text-secondary"
            style={{
              height: 300,
              cursor: "pointer",
              border: "2px dashed #6c757d",
              borderRadius: 8,
            }}
          >
            <i className="bi bi-cloud-upload fs-1"></i>
            <p>Drag & Drop Images Here or Click to Upload</p>
            <small>Max {MAX_IMAGES} images</small>
          </div>
        )}
      </div>
    </div>
  );
}
