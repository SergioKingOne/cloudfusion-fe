import axios from "axios";

const API_BASE_URL = process.env.API_BASE_URL;

export const saveEntry = async (entry) => {
  const formData = new FormData();
  Object.keys(entry).forEach((key) => {
    if (key === "photos") {
      entry[key].forEach((photo) => formData.append("photos", photo));
    } else {
      formData.append(key, entry[key]);
    }
  });

  const response = await axios.post(`${API_BASE_URL}/entries`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const fetchEntries = async () => {
  const response = await axios.get(`${API_BASE_URL}/entries`);
  return response.data;
};
