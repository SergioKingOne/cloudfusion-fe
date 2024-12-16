import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import TravelMap from "./components/TravelMap";
import TravelEntryForm from "./components/TravelEntryForm";
import TravelList from "./components/TravelList";
import Auth from "./components/Auth";
import { saveEntry, fetchEntries } from "./api/api";
import { useAuth } from "./contexts/AuthContext";

const App = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    const loadEntries = async () => {
      setLoading(true);
      try {
        const data = await fetchEntries();
        setEntries(data);
      } catch (err) {
        setError("Failed to load entries");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadEntries();
  }, []);

  const handleNewEntry = async (entry) => {
    setLoading(true);
    setError(null);
    try {
      const savedEntry = await saveEntry(entry);
      setEntries((prev) => [...prev, savedEntry]);
      setSelectedPosition(null);
    } catch (err) {
      setError("Failed to save entry. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (latlng) => {
    console.log("Location selected:", {
      coordinates: latlng,
      timestamp: new Date().toISOString(),
    });
    setSelectedPosition(latlng);
  };

  const handleEntryDeleted = (deletedEntryId) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== deletedEntryId));
  };

  const handleEntryUpdated = (updatedEntry) => {
    setEntries((prev) =>
      prev.map((entry) => (entry.id === updatedEntry.id ? updatedEntry : entry))
    );
  };

  if (authLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div>
      <Navbar />
      <div className="container">
        <TravelMap
          entries={entries}
          onLocationSelect={handleLocationSelect}
          selectedPosition={selectedPosition}
        />
        <TravelEntryForm
          onSubmit={handleNewEntry}
          loading={loading}
          selectedPosition={selectedPosition}
          onSuccess={() => setSelectedPosition(null)}
          onLocationSelect={handleLocationSelect}
        />
        {error && <div className="error">{error}</div>}
        <TravelList
          entries={entries}
          onEntryDeleted={handleEntryDeleted}
          onEntryUpdated={handleEntryUpdated}
        />
      </div>
    </div>
  );
};

export default App;
