import React, { useState } from "react";
import PropTypes from "prop-types";

const ImageGallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [errorImages, setErrorImages] = useState(new Set());

  const handleImageLoad = (imageUrl) => {
    setLoadedImages((prev) => new Set([...prev, imageUrl]));
  };

  const handleImageError = (imageUrl) => {
    setErrorImages((prev) => new Set([...prev, imageUrl]));
    console.error(`Failed to load image: ${imageUrl}`);
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="image-gallery">
      <div className="gallery-grid">
        {images.map((imageUrl, index) => {
          if (errorImages.has(imageUrl)) return null;

          return (
            <div
              key={index}
              className={`gallery-item ${
                loadedImages.has(imageUrl) ? "loaded" : "loading"
              }`}
              onClick={() => setSelectedImage(imageUrl)}
            >
              {!loadedImages.has(imageUrl) && (
                <div className="image-placeholder skeleton" />
              )}
              <img
                src={imageUrl}
                alt={`Travel moment ${index + 1}`}
                loading="lazy"
                onLoad={() => handleImageLoad(imageUrl)}
                onError={() => handleImageError(imageUrl)}
                style={{ opacity: loadedImages.has(imageUrl) ? 1 : 0 }}
              />
            </div>
          );
        })}
      </div>

      {selectedImage && (
        <div className="image-modal" onClick={() => setSelectedImage(null)}>
          <button
            className="close-modal"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
          >
            ×
          </button>
          <img
            src={selectedImage}
            alt="Full size view"
            onError={() => {
              setSelectedImage(null);
              handleImageError(selectedImage);
            }}
          />
        </div>
      )}
    </div>
  );
};

ImageGallery.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ImageGallery;
