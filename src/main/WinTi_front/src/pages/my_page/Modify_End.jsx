import React from "react";
import Logo from "../../assets/img/logo2/logoMain.png";
import { useNavigate } from "react-router-dom";

const Modify_End = () => {
  const navigator = useNavigate();

  const go_home = () => {
    navigator("/");
  };

  const go_my_page = () => {
    navigator("/My_Page");
  };

  return (
    <div className="Modify_End">
      <img src={Logo} alt="Logo" />
      <div className="text_1">수정이 완료되었습니다!</div>

      <div className="go_butten">
        <button onClick={go_home} className="go_home_butten">
          홈으로
        </button>
        <button onClick={go_my_page} className="go_my_page_butten">
          마이 페이지
        </button>
      </div>
    </div>
  );
};

export default Modify_End;
