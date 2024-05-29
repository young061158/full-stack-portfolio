import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/api/winti";

export const createRound = (showAddId, round) =>
  axios.post(`${REST_API_BASE_URL}/show_add/round/${showAddId}`, round);

export const getRoundList = (showId) =>
  axios.get(`${REST_API_BASE_URL}/show_add/round/list/${showId}`);

export const removeRound = (roundId) =>
  axios.delete(`${REST_API_BASE_URL}/show_add/round/${roundId}`);

export const removeRoundList = (showAddId) =>
  axios.delete(`${REST_API_BASE_URL}/show_add/round/list/${showAddId}`);
