import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/api/winti";
const config = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
};
export const createActor = (actor) =>
  axios.post(`${REST_API_BASE_URL}/show_add/actor`, actor, config);

export const getActorList = (showId) =>
  axios.get(`${REST_API_BASE_URL}/show_add/actor/${showId}`);
