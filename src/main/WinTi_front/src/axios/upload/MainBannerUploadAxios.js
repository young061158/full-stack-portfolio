import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/api/";

//배너 업로드
export const mainBannerUpload = (formData) => {
  return axios.post(REST_API_BASE_URL + "bannerUpload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

//배너 삭제
export const mainBannerDelete = (formData) => {
  return axios.post(REST_API_BASE_URL + "bannerDelete", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

//배너 수정
export const mainBannerUpdate = (formData) => {
  return axios.post(REST_API_BASE_URL + "bannerUpdate", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

//배너 찾기
export const getBannerById = (userId, title) => {
  return axios.get(REST_API_BASE_URL + "banner/find", {
    params: { userId, title },
  });
};
