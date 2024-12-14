import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useToast } from "../contexts/ToastContext";
import { deleteEntry, fetchEntryImages, updateEntry } from "../api/api";
import ImageGallery from "./ImageGallery";
import TravelEntryForm from "./TravelEntryForm";

const TravelEntry = ({ entry, onDelete, onUpdate }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const loadImages = async () => {
      try {
        const entryImages = await fetchEntryImages(entry.id);
        setImages(entryImages.map((img) => img.url));
      } catch (error) {
        console.error("Failed to load images for entry:", entry.id);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, [entry.id]);

  const handleUpdate = async (updatedEntry) => {
    try {
      const result = await updateEntry(entry.id, updatedEntry);
      onUpdate(result);
      setIsEditing(false);
      addToast("Entry updated successfully", "success");
    } catch (error) {
      addToast("Failed to update entry", "error");
    }
  };

  if (isEditing) {
    return (
      <TravelEntryForm
        initialEntry={{
          ...entry,
          date: new Date(entry.visit_date || entry.visitDate)
            .toISOString()
            .split("T")[0],
          coordinates: {
            lat: entry.coordinates.lat || entry.latitude,
            lng: entry.coordinates.lng || entry.longitude,
          },
        }}
        onSubmit={handleUpdate}
        onCancel={() => setIsEditing(false)}
        isEditing={true}
      />
    );
  }

  return (
    <div className="entry-card">
      {!loading && images.length > 0 && <ImageGallery images={images} />}
      <div className="entry-details">
        <div className="entry-header">
          <h3>{entry.title}</h3>
          <div className="entry-actions">
            <button
              className="edit-button"
              onClick={() => setIsEditing(true)}
              aria-label="Edit entry"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                width="20"
                height="20"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            <button
              className="delete-button"
              onClick={() => onDelete(entry.id)}
              aria-label="Delete entry"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                width="20"
                height="20"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
        <p className="entry-location">{entry.location}</p>
        <p className="entry-date">
          {new Date(entry.visit_date || entry.visitDate).toLocaleDateString()}
        </p>
        <p className="entry-description">{entry.description}</p>
      </div>
    </div>
  );
};

const TravelList = ({ entries, onEntryDeleted, onEntryUpdated }) => {
  const { addToast } = useToast();

  const handleDelete = async (entryId) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      try {
        await deleteEntry(entryId);
        addToast("Entry deleted successfully", "success");
        onEntryDeleted(entryId);
      } catch (error) {
        addToast("Failed to delete entry", "error");
      }
    }
  };

  return (
    <div className="travel-list">
      <h2>My Travels</h2>
      {entries.length === 0 ? (
        <p>No travel entries yet. Start by adding your first journey!</p>
      ) : (
        <div className="entries-grid">
          {entries.map((entry) => (
            <TravelEntry
              key={entry.id}
              entry={entry}
              onDelete={handleDelete}
              onUpdate={onEntryUpdated}
            />
          ))}
        </div>
      )}
    </div>
  );
};

TravelList.propTypes = {
  entries: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      location: PropTypes.string.isRequired,
      visit_date: PropTypes.string,
      visitDate: PropTypes.string,
      description: PropTypes.string.isRequired,
      photos: PropTypes.arrayOf(
        PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(File)])
      ),
    })
  ).isRequired,
  onEntryDeleted: PropTypes.func.isRequired,
  onEntryUpdated: PropTypes.func.isRequired,
};

export default TravelList;
