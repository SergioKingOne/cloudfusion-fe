import axios from "axios";
import { getSession, getCurrentAuthUser } from "../services/authService";
import { config } from "../config/config";

const API_BASE_URL = config.API_BASE_URL;

// Create axios instance with proper baseURL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add better error handling in the interceptor
api.interceptors.request.use(async (config) => {
  try {
    const session = await getSession();
    console.log("Session:", session); // Add this log
    if (session) {
      const token = session.getIdToken().getJwtToken();
      console.log(
        "Adding auth token to request:",
        token.substring(0, 20) + "..."
      );
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("No session found"); // Add this log
    }
    return config;
  } catch (error) {
    console.error("Error in request interceptor:", error);
    return Promise.reject(error);
  }
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    if (error.code === "ERR_CONNECTION_REFUSED") {
      throw new Error(
        "Unable to connect to the server. Please check if the backend is running."
      );
    }
    throw error;
  }
);

// Create user in backend after Cognito signup
export const createUser = async () => {
  try {
    const cognitoUser = await getCurrentAuthUser();
    console.log("Current Cognito user:", cognitoUser); // Debug log

    if (!cognitoUser) {
      throw new Error("No authenticated user found");
    }

    const userData = {
      name: cognitoUser.attributes.name,
      email: cognitoUser.attributes.email,
      cognito_id: cognitoUser.username,
    };

    console.log("Attempting to create user with data:", userData); // Debug log

    const response = await api.post("/api/users", userData);
    console.log("User creation response:", response.data); // Debug log
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      console.error("Error response headers:", error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error setting up request:", error.message);
    }
    throw error;
  }
};

export const saveEntry = async (entry) => {
  const session = await getSession();
  if (!session) {
    throw new Error("User must be signed in to save entries");
  }

  try {
    // Transform the entry data to match backend expectations
    const transformedEntry = {
      title: entry.title,
      description: entry.description,
      location: entry.location,
      latitude: entry.coordinates.lat,
      longitude: entry.coordinates.lng,
      visitDate: new Date(entry.date).toISOString(),
    };

    const response = await api.post(`/travel-entries`, transformedEntry);

    // Handle photo uploads
    if (entry.photos?.length > 0) {
      for (const photo of entry.photos) {
        try {
          const {
            data: { upload_url, key },
          } = await api.post(`/uploads/presigned-url`, {
            file_type: photo.type,
          });

          await axios.put(upload_url, photo, {
            headers: {
              "Content-Type": photo.type,
              "Access-Control-Allow-Origin": "*",
            },
          });

          await api.post(`/travel-entries/${response.data.id}/images`, {
            image_key: key,
          });
        } catch (photoError) {
          console.error("Error uploading photo:", photoError);
          throw photoError;
        }
      }
    }

    return response.data;
  } catch (error) {
    console.error("Error in saveEntry:", error);
    throw error;
  }
};

export const fetchEntries = async () => {
  const response = await api.get(`/travel-entries`);
  // Transform the data to match frontend expectations
  return response.data.map((entry) => ({
    ...entry,
    visit_date: entry.visitDate || entry.visit_date, // Handle both formats
    visitDate: entry.visitDate || entry.visit_date, // Include both for compatibility
    coordinates: {
      lat: entry.latitude,
      lng: entry.longitude,
    },
  }));
};

export const deleteEntry = async (entryId) => {
  try {
    await api.delete(`/travel-entries/${entryId}`);
    return true;
  } catch (error) {
    console.error("Error deleting entry:", error);
    console.error("Error details:", error.response?.data);
    throw error;
  }
};

export const fetchEntryImages = async (entryId) => {
  try {
    // First get the image records
    const response = await api.get(`/travel-entries/${entryId}/images`);
    console.log("Image response data:", response.data); // Debug the response

    // For each image, get a presigned download URL
    const imagesWithUrls = await Promise.all(
      response.data.map(async (image) => {
        try {
          const presignedResponse = await api.post(`/uploads/download-url`, {
            key: image.image_key,
          });
          return {
            id: image.id,
            url: presignedResponse.data.download_url,
          };
        } catch (error) {
          console.error(
            "Error getting presigned URL for image:",
            image.image_key
          );
          return null;
        }
      })
    );

    // Filter out any failed presigned URL requests
    return imagesWithUrls.filter((img) => img !== null);
  } catch (error) {
    console.error("Error fetching entry images:", error);
    throw error;
  }
};

export const reverseGeocode = async (lat, lng) => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    return response.data.display_name;
  } catch (error) {
    console.error("Reverse geocoding failed:", error);
    return null;
  }
};

export const searchLocations = async (query) => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&limit=5`
    );
    return response.data.map((place) => ({
      display_name: place.display_name,
      lat: parseFloat(place.lat),
      lng: parseFloat(place.lon),
    }));
  } catch (error) {
    console.error("Location search failed:", error);
    return [];
  }
};

export const updateEntry = async (entryId, entry) => {
  try {
    const transformedEntry = {
      title: entry.title,
      description: entry.description,
      location: entry.location,
      latitude: entry.coordinates.lat,
      longitude: entry.coordinates.lng,
      visitDate: new Date(entry.date).toISOString(),
    };

    const response = await api.put(
      `/travel-entries/${entryId}`,
      transformedEntry
    );

    // Handle photo updates if needed
    if (entry.photos && entry.photos.length > 0) {
      for (const photo of entry.photos) {
        if (photo instanceof File) {
          // Only upload new files
          const {
            data: { upload_url, key },
          } = await api.post(`/uploads/presigned-url`, {
            file_type: photo.type,
          });

          await axios.put(upload_url, photo, {
            headers: {
              "Content-Type": photo.type,
              "Access-Control-Allow-Origin": "*",
            },
          });

          await api.post(`/travel-entries/${entryId}/images`, {
            image_key: key,
          });
        }
      }
    }

    return response.data;
  } catch (error) {
    console.error("Error in updateEntry:", error);
    throw error;
  }
};
