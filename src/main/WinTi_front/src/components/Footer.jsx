import React from "react";
import Logo from "../assets/img/logo2/LogoWhite.png";

const Footer = () => {
  return(
  <div className="footer">
    <div className="footer_main">
    <div className="logo_text">
     <img src={Logo} alt="Logo" />
      <div className="text_1">개인정보처리방침</div>
      <div className="text_2">이용약관</div>
    </div>

    <div className="body_text">
      <div className="text_1">우 ) 03737 서울특별시 서대문구 마야리7 상수빌딩 6층 은영예술극장 560-82-0018</div> 
      <div className="text_2">COPYRIGHT 2023 MODU. ALL RIGHTS RESERVED.</div> 
    </div>
    </div>
  </div>
  );
};

export default Footer;
