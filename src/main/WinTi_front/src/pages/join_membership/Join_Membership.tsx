import React, { useState, useRef, useEffect } from "react";
import { ReactComponent as JoinImg } from "../../assets/img/join_membership/membership1.svg";
import { ReactComponent as JoinButten } from "../../assets/img/join_membership/Join_butten.svg";
import Membership from "../../data/Membership.js";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { ResponseBody } from "../../axios/types/index.ts";
import { FindUserResponseDto } from "../../axios/member/response/auth";
import ResponseCode from "../../axios/types/enums/response-code.enum.ts";
import { findUserRequest } from "../../axios/MemberAxios.ts";
import FindUserRequestDto from "../../axios/member/request/auth/find-user.dto.ts";
import { useLocation } from 'react-router-dom';


const Join_Membership = () => {

  const location = useLocation();
  const { key } = location.state || {}; // 기본값을 위해 빈 객체를 추가


  const [cookies, setCookie, removeCookie] = useCookies();
  const navigator = useNavigate();
  const [checkbox1, setCheckbox1] = useState(false);
  const [checkbox2, setCheckbox2] = useState(false);
  const [checkbox3, setCheckbox3] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userType, setUserType] = useState<string>('');


  const findUserResponse = (ResponseBody: ResponseBody<FindUserResponseDto>) => {
    if (!ResponseBody) return;
    const { code, id, username, type } = ResponseBody;
    if (code === ResponseCode.SIGN_IN_FAIL) alert("등록되지 않은 사용자 입니다.")
    if (code === ResponseCode.SUCCESS) {
      if (type !== null) {
        setUserType(type)
      }

    }
  }


  useEffect(() => {
    const token = cookies.accessToken;
    if (token) {
      setCookie("accessToken", token, { path: '/' });
    }
    const requestBody: FindUserRequestDto = { token };
    findUserRequest(requestBody).then(findUserResponse);
  }, [cookies.accessToken, setCookie]);

  const handleCheckAll = () => {
    if (!checkbox3) {
      setCheckbox1(true);
      setCheckbox2(true);
      setCheckbox3(true);
    } else {
      setCheckbox1(false);
      setCheckbox2(false);
      setCheckbox3(false);
    }
  };

  const toggleModal = (e) => {
    e.preventDefault();
    setShowModal(!showModal);
  };
  const closeModal = () => {
    setShowModal(false);
  };

  const nextpage = () => {
    if (checkbox1 && checkbox2) {
      if (key === "app") {
        navigator("/Join_Membership_main");
      } else {
        navigator("/Sns_Membership");
      }
    } else {
      alert("필수 항목을 체크해주세요.");
    }
  };

  const okorno = checkbox1 && checkbox2 ? "ok_butten" : "no_buutten";

  return (
    <>
      <div className="Join_Membership">
        <div className="svg">
          <JoinImg />
        </div>
        <form>
          <div className="ok">
            <div className="Imok">필수동의</div>
            <div className="line1"></div>

            <div className="container">
              <div className="butten_one">
                <label htmlFor="checkbox-1">
                  <input
                    type="checkbox"
                    id="checkbox-1"
                    name="checkbox-1"
                    checked={checkbox1}
                    onChange={() => setCheckbox1(!checkbox1)}
                  />
                  필수 동의 항목입니다
                  <button
                    className="buttenimg"
                    onClick={(e) => {
                      toggleModal(e);
                    }}
                  >
                    <JoinButten />
                  </button>
                </label>
              </div>
              <div className="line2"></div>
              <label htmlFor="checkbox-2">
                <input
                  type="checkbox"
                  id="checkbox-2"
                  name="checkbox-2"
                  checked={checkbox2}
                  onChange={() => setCheckbox2(!checkbox2)}
                />
                만 14세 이상입니다
              </label>
              <div className="line2"></div>
              <label htmlFor="checkbox-3" className="checkbox-3">
                <input
                  type="checkbox"
                  id="checkbox-3"
                  name="checkbox-3"
                  checked={checkbox3}
                  onChange={handleCheckAll}
                />
                모든 항목에 전체 동의합니다 ( 필수 )
              </label>
            </div>
          </div>
          <div className={okorno} onClick={nextpage}>
            다음
          </div>
        </form>

        {/* 모달 창 */}
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>필수 약관</h2>
              <div className="line"></div>
              <p>
                <Membership />
              </p>
              <button onClick={closeModal}>확인</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Join_Membership;