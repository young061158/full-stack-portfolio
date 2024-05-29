import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ReactComponent as Buy_svg } from '../../assets/img/my_page/buy.svg';
import { ReactComponent as Information_svg } from '../../assets/img/my_page/information.svg';
import { ReactComponent as Seller_svg } from '../../assets/img/my_page/seller.svg';
import { ReactComponent as Ticket_svg } from '../../assets/img/my_page/ticket.svg';
import { ResponseBody } from "../../axios/types";
import { DisableUserResponseDto, FindUserResponseDto } from "../../axios/member/response/auth";
import  ResponseCode  from "../../axios/types/enums/response-code.enum.ts";
import FindUserRequestDto from "../../axios/member/request/auth/find-user.dto.ts";
import { findUserRequest ,disableUser } from "../../axios/MemberAxios.ts";
import { Link, useNavigate } from "react-router-dom";
import { DisableUserRequestDto } from "../../axios/member/request/auth";


const Disable_User = () => {
  const [checkbox2, setCheckbox2] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies();
  const [buttonDisabled, setButtonDisabled] = useState(true); // 버튼의 기본 상태를 비활성화로 설정합니다.
  const [userId , setUserId] = useState("");

  const navigator = useNavigate();

  const findUserResponse = (ResponseBody : ResponseBody<FindUserResponseDto>) => {
    if(!ResponseBody)return;
    const {code , id , username} = ResponseBody;
    if(code === ResponseCode.SIGN_IN_FAIL) alert("등록되지 않은 사용자 입니다.")
    if(code === ResponseCode.SUCCESS){
      if (id !== undefined) {
        setUserId(id)
      }
    }
  }

  const disableUserResponse = (ResponseBody : ResponseBody<DisableUserResponseDto>) => {
    if(!ResponseBody)return;
    const {code} = ResponseBody;
    if(code === ResponseCode.SUCCESS){
      alert("회원 탈퇴 완료.")
      handleLogout();
      navigator("/")
    }
  }

  const handleLogout = () => {
    // Remove the accessToken cookie
    unlinkKakaoUser();
    removeCookie("accessToken");
    removeCookie("refreshToken");
    // setIsLoggedIn(false);
  };

  const unlinkKakaoUser = () => {
    const serviceAppAdminKey = '98c31673cd15333a347735aec6234d96'; 
    const kakaoUserId = userId;
    axios({
      method: "POST",
      url: "https://kapi.kakao.com/v1/user/unlink",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `KakaoAK ${serviceAppAdminKey}`, // 서비스 앱 어드민 키 포함
      },
      data: {
        target_id_type: "user_id",
        target_id: kakaoUserId,
      },
    })
    .then(() => {
      window.location.href = "/"; // 로그아웃 성공 후 리다이렉트할 경로
    })
    .catch((error) => {
      console.log("Error:", error);
      if (error.response && error.response.data && error.response.data.code === -401) {
        window.location.href = "/"; // 로그아웃 실패 시 리다이렉트할 경로
      }
    });
  };

  useEffect(() => {
    const token = cookies.accessToken;
    const requestBody: FindUserRequestDto = {token};
    findUserRequest(requestBody).then(findUserResponse);
  });


  const handleSubmit = () => {
    const requestBody: DisableUserRequestDto = {userId};
    disableUser(requestBody).then(disableUserResponse);
  };

  const disable_button = () => {
    return checkbox2 ? "active" : "inactive";
  };

  return (
    <div className="Disable_User">
        <h1>탈퇴 안내</h1>
        <div>회원 탈퇴를 신청하기 전에 안내 사항을 꼭 확인해 주세요.</div>

        <div className="text_1">
        <div className='Circle'></div>
        <div className='text_one'>사용하고 계신 아이디는 탈퇴한 경우 재사용 및 복구가 불가능합니다.</div>
        </div>
        <div className='text_one_1'>탈퇴한 아이디는 본인과 타인 모두 재사용 및 복구가 불가하오니 신중하게 선택하시기 바랍니다.</div>

        <div className="text_2">
        <div className='Circle'></div>
        <div className='text_two'>탈퇴 후에도 게시판형 서비스에 등록한 게시물은 그대로 남아 있습니다.</div>
        </div>
        <div className='text_one_2'>회원 티켓 , 공연 등록 , 댓글 등은 탈퇴 시 자동 삭제되지 않고 그대로 남아 있습니다.<br></br>
        삭제를 원하는 게시글이 있다면 반드시 탈퇴 전 비공개 처리하거나 삭제하시기 바랍니다.<br></br>
        탈퇴 후에는 회원정보가 삭제되어 본인 여부를 확인할 수 있는 방법이 없어, 게시글을 임의로 삭제해드릴 수 없습니다.
        </div>

        <div className='lien'></div>
        <div className='last_text'>
        탈퇴 후에는 사용한 아이디로 다시 가입할 수 없으며 아이디와 데이터는 복구할 수 없습니다. <br></br>
        게시판형 서비스에 남아 있는 게시글은 탈퇴 후 삭제할 수 없습니다.<br></br>
        또한, 등록한 공연 및 예매한 서비스에 대해서 이용을 할 수 없습니다.<br></br>
        </div>

        <div className="you_ok">
        <input
          type="checkbox"
          id="checkbox-2"
          name="checkbox-2"
          checked={checkbox2}
          onChange={() => setCheckbox2(!checkbox2)}
          className="checkbox-input"
        />
        <label htmlFor="checkbox-2" className="checkbox-label">안내 사항을 모두 확인하였으며, 이에 동의합니다.</label>
      </div>

      <div className="button-container">
        <button className={disable_button()} onClick={handleSubmit}>확인</button>
      </div>
    </div>
  )
}

export default Disable_User