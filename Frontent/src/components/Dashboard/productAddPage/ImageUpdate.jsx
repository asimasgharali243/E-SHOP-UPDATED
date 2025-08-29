import React, { useRef, useState } from "react";

export default function ImageUpload({
  images,
  setImages,
  MAX_IMAGES = 6,
  uploadProgress,
  existingImages,
}) {
  const fileInputRef = useRef();
  const [mainIndex, setMainIndex] = useState(0); // index of main image

  const handleAddFiles = (files) => {
    const newFiles = Array.from(files).slice(0, MAX_IMAGES - images.length);
    const formatted = newFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      originalName: file.name,
      isNew: true,
    }));
    setImages([...images, ...formatted]);
  };

  const handleRemove = (index) => {
    const img = images[index];
    if (img.isNew && img.url) URL.revokeObjectURL(img.url);
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);

    // Adjust mainIndex if needed
    if (mainIndex === index) setMainIndex(0);
    else if (mainIndex > index) setMainIndex(mainIndex - 1);
  };

  const canAddMore = images.length < MAX_IMAGES;

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        hidden
        multiple
        accept="image/*"
        onChange={(e) => {
          if (e.target.files.length) handleAddFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {images.length > 0 && (
        <div
          style={{
            width: "100%",
            height: 300,
            marginBottom: 10,
            border: "1px solid #ccc",
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          <img
            src={images[mainIndex].url || images[mainIndex].thumbnailUrl}
            alt={images[mainIndex].originalName || "main"}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      )}

      <div className="d-flex flex-wrap gap-2 mb-3">
        {images.map((img, idx) => (
          <div
            key={idx}
            style={{
              position: "relative",
              width: 60,
              height: 60,
              border:
                mainIndex === idx ? "2px solid #007bff" : "1px solid #ccc",
              borderRadius: 8,
              overflow: "hidden",
              cursor: "pointer",
            }}
            onClick={() => setMainIndex(idx)}
          >
            <img
              src={img.url || img.thumbnailUrl}
              alt={img.originalName || "img"}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation(); // prevent selecting as main
                handleRemove(idx);
              }}
              style={{
                position: "absolute",
                top: 2,
                right: 2,
                background: "rgba(255,255,255,0.7)",
                border: "none",
                borderRadius: "50%",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>
        ))}

        {canAddMore && (
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              width: 60,
              height: 60,
              border: "2px dashed #ccc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            +
          </div>
        )}
      </div>
    </div>
  );
}
