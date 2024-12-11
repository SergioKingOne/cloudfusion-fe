import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
const HARDCODED_USER_ID = 1; // For development

export const saveEntry = async (entry) => {
  try {
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
      console.log("Uploading photos:", entry.photos);

      for (const photo of entry.photos) {
        try {
          // First get a presigned URL
          console.log("Getting presigned URL for:", photo.type);
          const {
            data: { upload_url, key },
          } = await axios.post(`${API_BASE_URL}/uploads/presigned-url`, {
            file_type: photo.type,
          });

          console.log("Got presigned URL:", upload_url);

          // Upload to S3
          await axios.put(upload_url, photo, {
            headers: {
              "Content-Type": photo.type,
              "Access-Control-Allow-Origin": "*",
            },
          });

          // Associate image with entry
          await axios.post(
            `${API_BASE_URL}/travel-entries/${response.data.id}/images`,
            {
              image_key: key,
            }
          );
        } catch (photoError) {
          console.error("Error uploading photo:", photoError);
          console.error("Error details:", photoError.response?.data);
          throw photoError;
        }
      }
    }

    return response.data;
  } catch (error) {
    console.error("Error in saveEntry:", error);
    console.error("Error details:", error.response?.data);
    throw error;
  }
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

export const deleteEntry = async (entryId) => {
  try {
    await axios.delete(`${API_BASE_URL}/travel-entries/${entryId}`);
    return true;
  } catch (error) {
    console.error("Error deleting entry:", error);
    console.error("Error details:", error.response?.data);
    throw error;
  }
};
