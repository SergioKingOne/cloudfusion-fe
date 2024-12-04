import React, { useState } from "react";
import Navbar from "./components/Navbar";
import TravelMap from "./components/TravelMap";
import TravelEntryForm from "./components/TravelEntryForm";
import TravelList from "./components/TravelList";
import { saveEntry, fetchEntries } from "./api/api";

const App = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleNewEntry = async (entry) => {
    setLoading(true);
    setError(null);
    try {
      const savedEntry = await saveEntry(entry);
      setEntries((prev) => [...prev, savedEntry]);
    } catch (err) {
      setError("Failed to save entry. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <TravelMap entries={entries} />
        <TravelEntryForm onSubmit={handleNewEntry} loading={loading} />
        {error && <div className="error">{error}</div>}
        <TravelList entries={entries} />
      </div>
    </div>
  );
};

export default App;
