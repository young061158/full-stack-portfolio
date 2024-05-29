import React from 'react'
import {  SNS_SIGN_IN_URL, signInRequest } from "../../axios/MemberAxios.ts";
import { useNavigate , useParams  } from "react-router-dom";

const Choice_Membership = () => {

  const navigate = useNavigate();




  // const gogogo = () => {
  //   navigate("/Join_Member")
  // }



  const gogogo = () => {
    navigate("/Join_Member", { state: { key: "app" } });
  };

  const onSnsSignInButtonClickHandler = (type: 'kakao' | 'naver') => {
    window.location.href = SNS_SIGN_IN_URL(type);
  }
  
  return (
    <>
    <div className='text_main_choice_member'>회원 가입</div>
    <div className='Choice_Membership'>

    <div className='app_login' >
      <div className='app_png' onClick={gogogo}></div>
      <div className='text'>App 회원가입</div>
      <div className='app_butten'></div>
    </div>

    <div className='lien'></div>

    <div className='sns_login'>
      <div className="sign-in-content-sns-in-box">


          <div className="sign-in-content-sns-sign-in-button-box_choice">

            <div className='kakao' onClick={()=> onSnsSignInButtonClickHandler('kakao')}>
            <div className="kakao-sign-in-button"></div>
            <div className='kakao_text'>카카오 간편가입</div>
            </div>
            <div className='naver' onClick={()=> onSnsSignInButtonClickHandler('naver')}>
            <div className="naver-sign-in-button" ></div>
            <div className='naver_text'>네이버 간편가입</div>
            </div>
            <div className="sign-in-content-sns-sign-in-title">{'SNS 회원가입'}</div>
          </div>
        </div>

    </div>


    </div>
    </>
  )
}

export default Choice_Membership