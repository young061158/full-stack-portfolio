import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { ReactComponent as Buy_svg } from '../../assets/img/my_page/buy.svg';
import { ReactComponent as Information_svg } from '../../assets/img/my_page/information.svg';
import { ReactComponent as Seller_svg } from '../../assets/img/my_page/seller.svg';
import { ReactComponent as Ticket_svg } from '../../assets/img/my_page/ticket.svg';
import { ResponseBody } from "../../axios/types";
import { FindUserResponseDto } from "../../axios/member/response/auth";
import ResponseCode from "../../axios/types/enums/response-code.enum.ts";
import FindUserRequestDto from "../../axios/member/request/auth/find-user.dto.ts";
import { findUserRequest } from "../../axios/MemberAxios.ts";
import { Link, useNavigate } from "react-router-dom";
import MobileTicket from "./Mobile_ticket.tsx";

const My_Page_Main = () => {
  const [cookies, setCookie, removeCookie] = useCookies();
  const [username, setUsername] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const navigate = useNavigate();

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const findUserResponse = (ResponseBody: ResponseBody<FindUserResponseDto>) => {
    if (!ResponseBody) return;
    const { code, id, username } = ResponseBody;
    if (code === ResponseCode.SIGN_IN_FAIL) alert("등록되지 않은 사용자 입니다.")
    if (code === ResponseCode.VALIDATION_FAIL) {
      alert("로그인이 필요한 서비스 입니다.");
      navigate("/Login")
    }
    if (code === ResponseCode.SUCCESS) {
      if (username !== undefined) {
        setUsername(username)
      }
      if (id !== undefined) {
        setUserId(id);
      }

    }
  }

  useEffect(() => {
    const token = cookies.accessToken;
    const requestBody: FindUserRequestDto = { token };
    findUserRequest(requestBody).then(findUserResponse);
    console.log("My_Page_Main 페이지 유저 정보 찾기")
  }, [cookies]);



  const disable_user = () => {

    navigate("/My_Page/Disable_User");

  }

  const ticketonClick = () => {
    openModal();
  };

  const buyClick = () => {
    navigate("/My_Page/user_Reservation");
  };

  const sellerClick = () => {
    navigate("/My_Page/seller_Registration");
  };

  const informationClick = () => {
    navigate("/My_Page/Modify_Account");
  };

  return (
    <div className='my_page_main'>
      <div className='page_header'>
        <div className="my_page_header">
          <div className='text'>마이페이지</div>
          <div className="user_disable" onClick={disable_user}>계정 탈퇴 </div>
        </div>
        <div className='line'></div>
        <div className='user_name'><span>{username}</span>님 반갑습니다</div>
      </div>

      <div className='menu'>
        <div className='ticket'>
          <div className="ticket_svg">
            <div className="ticket_onClick" onClick={ticketonClick}><Ticket_svg /></div>
            <div className='red-div'></div>
          </div>
          <div className='menu_text'>나의 모바일 티켓</div>
        </div>
        <div className='menu_lien'></div>
        <div className='seller'>
          <div className="seller_onClick" onClick={buyClick}><Seller_svg /></div>
          <div className='menu_text'>예매내역</div>
        </div>
        <div className='menu_lien'></div>
        <div className='buy'>
          <div className="buy_onClick" onClick={sellerClick}><Buy_svg /></div>
          <div className='menu_text'>등록내역</div>
        </div>
        <div className='menu_lien'></div>
        <div className='user_name'>
          <div className="information_onClick" onClick={informationClick}><Information_svg /></div>
          <div className='menu_text' id="text_4">개인정보 수정</div>
        </div>
      </div>

      <MobileTicket modalIsOpen={modalIsOpen} closeModal={closeModal} />
    </div>
  );
};

export default My_Page_Main;