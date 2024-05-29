import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/api/winti";
const config = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
};
export const createShow = (show) =>
  axios.post(`${REST_API_BASE_URL}/show_add/show_add`, show, config);

export const getShow = (showId) =>
  axios.get(`${REST_API_BASE_URL}/show_add/${showId}`);

// export const getShowList = (userId) =>
//   axios.get(`${REST_API_BASE_URL}/show_add/show/${userId}/list`);

export const modifyShow = (showId, show) =>
  axios.patch(`${REST_API_BASE_URL}/show_add/modify/${showId}`, show, config);

// export const removeShow = (showId) =>
//   axios.delete(`${REST_API_BASE_URL}/show_add/seats/show/${showId}`);
