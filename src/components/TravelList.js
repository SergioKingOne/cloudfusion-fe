import React from "react";
import PropTypes from "prop-types";
import { useToast } from "../contexts/ToastContext";
import { deleteEntry } from "../api/api";

const TravelList = ({ entries, onEntryDeleted }) => {
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="travel-list">
      <h2>My Travels</h2>
      {entries.length === 0 ? (
        <p>No travel entries yet. Start by adding your first journey!</p>
      ) : (
        <div className="entries-grid">
          {entries.map((entry) => (
            <div key={entry.id} className="entry-card">
              {entry.photos && entry.photos.length > 0 && (
                <div className="entry-photo">
                  <img
                    src={
                      typeof entry.photos[0] === "string"
                        ? entry.photos[0]
                        : URL.createObjectURL(entry.photos[0])
                    }
                    alt={entry.location}
                  />
                </div>
              )}
              <div className="entry-details">
                <div className="entry-header">
                  <h3>{entry.title}</h3>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(entry.id)}
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
                <p className="entry-location">{entry.location}</p>
                <p className="entry-date">
                  {formatDate(entry.visit_date || entry.visitDate)}
                </p>
                <p className="entry-description">{entry.description}</p>
              </div>
            </div>
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
};

export default TravelList;
