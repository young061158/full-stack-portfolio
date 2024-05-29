import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/api/winti";

export const createCoupon = (showId, coupon) =>
  axios.post(`${REST_API_BASE_URL}/show_add/coupon/${showId}`, coupon);

export const getCouponList = (userId) =>
  axios.get(`${REST_API_BASE_URL}/show_add/coupon/${userId}`);

export const modifyCoupon = (id, coupon) =>
  axios.put(`${REST_API_BASE_URL}/show_add/coupon/${id}`, coupon);

export const removeCoupon = (id) =>
  axios.delete(`${REST_API_BASE_URL}/show_add/coupon/${id}`);
