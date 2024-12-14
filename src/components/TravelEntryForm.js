import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { useToast } from "../contexts/ToastContext";
import { reverseGeocode, searchLocations } from "../api/api";

const TravelEntryForm = ({
  onSubmit,
  loading,
  selectedPosition,
  onSuccess,
  onLocationSelect,
  initialEntry,
  onCancel,
  isEditing,
}) => {
  const { addToast } = useToast();
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [entry, setEntry] = useState(
    initialEntry || {
      title: "",
      location: "",
      date: "",
      description: "",
      photos: [],
      coordinates: { lat: null, lng: null },
    }
  );
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    if (selectedPosition) {
      setEntry((prev) => ({
        ...prev,
        coordinates: {
          lat: selectedPosition.lat,
          lng: selectedPosition.lng,
        },
      }));
    }
  }, [selectedPosition]);

  useEffect(() => {
    const setLocationFromCoordinates = async () => {
      if (selectedPosition?.lat && selectedPosition?.lng) {
        try {
          const locationName = await reverseGeocode(
            selectedPosition.lat,
            selectedPosition.lng
          );
          if (locationName) {
            setEntry((prev) => ({
              ...prev,
              location: locationName,
            }));
          }
        } catch (error) {
          console.error("Failed to get location name:", error);
        }
      }
    };

    setLocationFromCoordinates();
  }, [selectedPosition]);

  const handleLocationSearch = async (value) => {
    setEntry((prev) => ({ ...prev, location: value }));

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Don't search if input is empty
    if (!value.trim()) {
      setSearchResults([]);
      return;
    }

    // Add debouncing to prevent too many API calls
    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchLocations(value);
        setSearchResults(results);
      } catch (error) {
        console.error("Failed to search locations:", error);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  };

  const handleLocationSelect = (result) => {
    setEntry((prev) => ({
      ...prev,
      location: result.display_name,
      coordinates: {
        lat: result.lat,
        lng: result.lng,
      },
    }));
    onLocationSelect({ lat: result.lat, lng: result.lng });
    setSearchResults([]); // Clear results after selection
  };

  // Reset form function
  const resetForm = () => {
    setEntry({
      title: "",
      location: "",
      date: "",
      description: "",
      photos: [],
      coordinates: { lat: null, lng: null },
    });
    setPreviews([]);
    if (onSuccess) onSuccess();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(entry);
      addToast("Travel entry saved successfully!", "success");
      resetForm(); // Reset all fields after successful submission
    } catch (error) {
      addToast("Failed to save travel entry", "error");
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files) => {
    const newPreviews = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setPreviews((prev) => [...prev, ...newPreviews]);

    setEntry((prev) => ({
      ...prev,
      photos: [...(prev.photos || []), ...Array.from(files)],
    }));
  };

  return (
    <div className="entry-form-container">
      <form className="entry-form" onSubmit={handleSubmit}>
        <h2>{isEditing ? "Edit Travel Entry" : "Add New Travel Entry"}</h2>
        <p className="form-instruction">
          Click on the map to select location coordinates
        </p>

        {/* File Upload Area */}
        <div
          className={`file-upload-area ${dragActive ? "drag-active" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFiles(e.target.files)}
            style={{ display: "none" }}
          />
          <div className="upload-message">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="upload-icon"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                clipRule="evenodd"
              />
            </svg>
            <p>Drag photos here or click to upload</p>
          </div>
        </div>

        {/* Image Previews */}
        {previews.length > 0 && (
          <div className="image-previews">
            {previews.map((preview, index) => (
              <div key={index} className="preview-item">
                <img src={preview.preview} alt="Preview" />
                <button
                  type="button"
                  className="remove-preview"
                  onClick={() => {
                    URL.revokeObjectURL(preview.preview);
                    setPreviews((prev) => prev.filter((_, i) => i !== index));
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={entry.title}
            onChange={(e) =>
              setEntry((prev) => ({ ...prev, title: e.target.value }))
            }
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <div className="location-search-container">
            <input
              type="text"
              id="location"
              value={entry.location}
              onChange={(e) => handleLocationSearch(e.target.value)}
              required
            />
            {isSearching && <div className="search-spinner"></div>}
            {searchResults.length > 0 && (
              <ul className="location-suggestions">
                {searchResults.map((result, index) => (
                  <li key={index} onClick={() => handleLocationSelect(result)}>
                    {result.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="date">Visit Date</label>
          <input
            type="date"
            id="date"
            value={entry.date}
            onChange={(e) =>
              setEntry((prev) => ({ ...prev, date: e.target.value }))
            }
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={entry.description}
            onChange={(e) =>
              setEntry((prev) => ({ ...prev, description: e.target.value }))
            }
            required
          />
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={
              loading || !entry.coordinates.lat || !entry.coordinates.lng
            }
          >
            {loading ? "Saving..." : isEditing ? "Update Entry" : "Save Entry"}
          </button>
          {isEditing && (
            <button type="button" onClick={onCancel} className="cancel-button">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

TravelEntryForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  selectedPosition: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
  onSuccess: PropTypes.func,
  onLocationSelect: PropTypes.func.isRequired,
  initialEntry: PropTypes.shape({
    title: PropTypes.string,
    location: PropTypes.string,
    date: PropTypes.string,
    description: PropTypes.string,
    photos: PropTypes.arrayOf(PropTypes.instanceOf(File)),
    coordinates: PropTypes.shape({
      lat: PropTypes.number,
      lng: PropTypes.number,
    }),
  }),
  onCancel: PropTypes.func,
  isEditing: PropTypes.bool,
};

export default TravelEntryForm;
