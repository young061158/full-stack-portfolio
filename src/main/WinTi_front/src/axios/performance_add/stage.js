import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/api/winti";

export const createStage = (roundId, seat) =>
  axios.post(`${REST_API_BASE_URL}/show_add/seats/${roundId}`, seat);

export const getSampleStage = (showId) =>
  axios.get(`${REST_API_BASE_URL}/show_add/seats/sample/${showId}`);

export const getRoundStage = (roundId) =>
  axios.get(`${REST_API_BASE_URL}/show_add/seats/${roundId}`);

export const modifyStage = (roundId, seat) =>
  axios.patch(`${REST_API_BASE_URL}/show_add/seats/${roundId}`, seat);

// export const removeSeat = (showId) =>
//   axios.delete(`${REST_API_BASE_URL}/show_add/seats/${showId}`);

export const removeStage = (showId) =>
  axios.delete(`${REST_API_BASE_URL}/show_add/seats/stage/${showId}`);
