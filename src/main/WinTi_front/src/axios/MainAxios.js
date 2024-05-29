import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/api/";

//메인페이지 open슬라이더
export const mainOpen = () => {
  return axios.get(REST_API_BASE_URL + "open");
};

//메인페이지 배너 -> 상세페이지
export const searchPerformancesByTitle = (userId, title, showId) => {
  return axios.get(REST_API_BASE_URL + "performances/byTitle", {
    params: { userId, title, showId },
  });
};

//메인페이지 banner슬라이더
export const mainBanner = () => {
  return axios.get(REST_API_BASE_URL + "banner");
};

//메인페이지 금일 인기
export const mainTodayHot = (category) => {
  return axios.get(REST_API_BASE_URL + "todayHot", { params: { category } });
};

//메인페이지 주간인기
export const mainWeekHot = (category) => {
  return axios.get(REST_API_BASE_URL + "weeklyHot", { params: { category } });
};

//메인페이지 카테고리
export const getPerformancesByCategory = (category) => {
  return axios.get(REST_API_BASE_URL + "performances", {
    params: { category },
  });
};

//메인페이지 검색
export const search = (query) => {
  return axios.get(REST_API_BASE_URL + "search", { params: { query } });
};
