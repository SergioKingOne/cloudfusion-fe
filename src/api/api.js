import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
const HARDCODED_USER_ID = 1; // For development

export const saveEntry = async (entry) => {
  // Transform the entry data to match backend expectations
  const transformedEntry = {
    user_id: HARDCODED_USER_ID,
    title: entry.title,
    description: entry.description,
    location: entry.location,
    latitude: entry.coordinates.lat,
    longitude: entry.coordinates.lng,
    visitDate: new Date(entry.date).toISOString(),
  };

  const response = await axios.post(
    `${API_BASE_URL}/travel-entries`,
    transformedEntry
  );

  // If there are photos, upload them
  if (entry.photos && entry.photos.length > 0) {
    for (const photo of entry.photos) {
      // First get a presigned URL
      const {
        data: { url, key },
      } = await axios.post(`${API_BASE_URL}/uploads/presigned-url`, {
        contentType: photo.type,
      });

      // Upload to S3
      await axios.put(url, photo, {
        headers: { "Content-Type": photo.type },
      });

      // Associate image with entry
      await axios.post(
        `${API_BASE_URL}/travel-entries/${response.data.id}/images`,
        {
          image_key: key,
        }
      );
    }
  }

  return response.data;
};

export const fetchEntries = async () => {
  const response = await axios.get(`${API_BASE_URL}/travel-entries`);
  // Transform the data to match frontend expectations
  return response.data.map((entry) => ({
    ...entry,
    coordinates: {
      lat: entry.latitude,
      lng: entry.longitude,
    },
  }));
};
