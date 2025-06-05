// src/api/timeRecommendation.js
import axios from './axiosInstance';

export const fetchTimeRecommendations = async (schoolType, month) => {
  const response = await axios.get(
    `/api/time-recommendations?schoolType=${schoolType}&month=${month}`
  );
  return response.data;
};

