import axios from 'axios';

export const fetchTimeRecommendations = async (grade, month) => {
    const response = await axios.get(
    `/api/time-recommendations?grade=${grade}&month=${month}`
);
return response.data.data;
};
