import React, { useRef, useCallback, useState, useEffect, useMemo } from "react";
import { useImageCompressor } from "../../CustomHook/ImageCompressCustomHook";

export default function ImageUpload({ images, setImages, MAX_IMAGES }) {
  const fileInputRef = useRef();
  const { compressImage } = useImageCompressor();
  const [isCompressing, setIsCompressing] = useState(false);
  const activeBlobUrls = useRef(new Set());

  // Create stable image references
  const stableImages = useMemo(() => images, [images]);

  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const removeImage = useCallback((indexToRemove) => {
    setImages((prev) => {
      const newImages = [...prev];
      const removedImage = newImages.splice(indexToRemove, 1)[0];
      
      // Revoke the URL if it exists and is in our active set
      if (removedImage?.previewUrl && activeBlobUrls.current.has(removedImage.previewUrl)) {
        URL.revokeObjectURL(removedImage.previewUrl);
        activeBlobUrls.current.delete(removedImage.previewUrl);
      }
      
      return newImages;
    });
  }, [setImages]);

  const handleImageClick = (clickedIndex) => {
    if (clickedIndex === 0) return;
    setImages((prev) => {
      const newArr = [...prev];
      [newArr[0], newArr[clickedIndex]] = [newArr[clickedIndex], newArr[0]];
      return newArr;
    });
  };

  const createImageObject = async (file) => {
    try {
      const compressedFile = await compressImage(file);
      const blob = compressedFile instanceof Blob ? compressedFile : file;
      const previewUrl = URL.createObjectURL(blob);
      activeBlobUrls.current.add(previewUrl);
      return {
        file: blob,
        previewUrl,
        originalName: file.name,
        lastModified: file.lastModified
      };
    } catch (error) {
      console.error("Compression failed:", file.name, error);
      const previewUrl = URL.createObjectURL(file);
      activeBlobUrls.current.add(previewUrl);
      return {
        file,
        previewUrl,
        originalName: file.name,
        lastModified: file.lastModified
      };
    }
  };

  const onFilesAdded = useCallback(async (files) => {
    if (isCompressing) return;
    setIsCompressing(true);
    
    try {
      const fileArray = Array.from(files);
      const compressedPreviews = await Promise.all(
        fileArray.map(file => createImageObject(file))
      );

      setImages((prev) => {
        const total = prev.length + compressedPreviews.length;
        if (total > MAX_IMAGES) {
          // Revoke URLs that won't be used
          compressedPreviews
            .slice(MAX_IMAGES - prev.length)
            .forEach(img => {
              URL.revokeObjectURL(img.previewUrl);
              activeBlobUrls.current.delete(img.previewUrl);
            });
          return [...prev, ...compressedPreviews.slice(0, MAX_IMAGES - prev.length)];
        }
        return [...prev, ...compressedPreviews];
      });
    } catch (error) {
      console.error("Image processing failed:", error);
    } finally {
      setIsCompressing(false);
    }
    console.log(images)
  }, [compressImage, setImages, MAX_IMAGES, isCompressing]);

  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files?.length > 0) {
      await onFilesAdded(e.dataTransfer.files);
    }
  };

  const onFileChange = async (e) => {
    if (e.target.files) {
      await onFilesAdded(e.target.files);
      e.target.value = ''; // Reset input
    }
  };

  // Clean up all object URLs when component unmounts
  useEffect(() => {
    return () => {
      activeBlobUrls.current.forEach(url => {
        URL.revokeObjectURL(url);
      });
      activeBlobUrls.current.clear();
    };
  }, []);

  // Fallback image for errors
  const handleImageError = (e) => {
    const target = e.target;
    target.onerror = null;
    target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZWVlZWVlIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzY2NjY2NiI+SW1hZ2UgRXJyb3I8L3RleHQ+PC9zdmc+';
    
    // Find and revoke the bad URL if it exists
    const badUrl = target.src;
    if (activeBlobUrls.current.has(badUrl)) {
      URL.revokeObjectURL(badUrl);
      activeBlobUrls.current.delete(badUrl);
    }
  };

  
  return (
    <div onDragOver={onDragOver} onDrop={onDrop} style={{ position: "relative" }}>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="image/*"
        multiple
        onChange={onFileChange}
      />

      <div className="bg-white p-3 rounded shadow-sm text-center" style={{
        minHeight: 500,
        backgroundColor: "#f8f9fa",
        userSelect: "none",
        position: "relative",
      }}>
        {/* Spinner Overlay */}
        {isCompressing && (
          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              zIndex: 10,
              borderRadius: 8,
            }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Compressing...</span>
            </div>
          </div>
        )}

        {/* Main Image or Drop Area */}
        {stableImages.length > 0 ? (
         <> <img
            src={stableImages[0].previewUrl}
            alt="Main product"
            className="img-fluid mb-3"
            onError={handleImageError}
            onClick={() => handleImageClick(0)}
            style={{
              objectFit: "contain",
              width: "100%",
              height: 300,
              borderRadius: 8,
              cursor: "pointer",
            }}
          />
          <div className="d-flex justify-content-end">{Number((stableImages[0]?.file.size/1024).toFixed(2))+"kb"}</div>
          </>
        ) : (
          <div
            className="d-flex align-items-center justify-content-center mb-3"
            style={{
              width: "100%",
              height: 300,
              backgroundColor: "#f8f9fa",
              borderRadius: 8,
              border: "2px dashed #ced4da",
              color: "#6c757d",
              fontSize: 18,
              cursor: "pointer",
            }}
            onClick={openFilePicker}
          >
            Drag & drop main image here or click +
          </div>
        )}

        {/* Thumbnails */}
        <div className="g-2 d-flex justify-content-center flex-wrap gap-2">
          {stableImages.slice(1).map((img, i) => {
            const realIndex = i + 1;
            return (
              <div
                key={`${img.originalName}-${img.lastModified}-${i}`}
                className="position-relative d-flex flex-column p-0"
                style={{ width: 100, borderRadius: 8 }}
              >
                <img
                  src={img.previewUrl}
                  alt={`Thumbnail ${i + 1}`}
                  className="img-thumbnail"
                  onError={handleImageError}
                  style={{
                    cursor: "pointer",
                    aspectRatio: "1/1",
                    objectFit: "cover",
                  }}
                  onClick={() => handleImageClick(realIndex)}
                />
                <button
                  type="button"
                  className="btn-close position-absolute"
                  onClick={() => removeImage(realIndex)}
                  style={{
                    cursor: "pointer",
                    fontSize: "15px",
                    top: "5px",
                    right: "5px",
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Add Image Button */}
        {stableImages.length < MAX_IMAGES && (
          <div
            className="mt-3"
            onClick={openFilePicker}
            style={{
              width: "100px",
              height: "100px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: `1px dashed var(--primary)`,
              cursor: "pointer",
            }}
          >
            <i className="bi bi-plus-circle fs-3" style={{ color: `var(--primary)` }}></i>
          </div>
        )}

        {/* Upload Limit Message */}
        {stableImages.length && (
          <div className=" mt-2">
            upload upto {stableImages.length}/{MAX_IMAGES} images
          </div>
        )}
      </div>
    </div>
  );
}