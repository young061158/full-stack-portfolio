import React, { useContext } from "react";
import { Route, Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext"; // 회원가입 상태를 관리하는 컨텍스트

const PrivateRoute = ({ element, ...props }) => {
  const { isSignedIn } = useContext(AuthContext); // 회원가입 상태 가져오기

  // 회원가입이 완료되지 않았으면 로그인 페이지로 리다이렉트
  return isSignedIn ? <Route {...props} element={element} /> : <Navigate to="/Login" />;
};

export default PrivateRoute;