import React, { ChangeEvent, useState, useRef, KeyboardEvent, useEffect } from "react";

import { useNavigate, useParams } from "react-router-dom";
import { SNS_SIGN_IN_URL, signInRequest } from "../../axios/MemberAxios.ts";
import InputBox from "../../components/Login/Input.tsx";

import SignInRequestDto from "../../axios/member/request/auth/sign-in.request.dto.ts";
import { ResponseBody } from "../../axios/types/index.ts";
import ResponseCode from "../../axios/types/enums/response-code.enum.ts";
import SignInResponseDto from "../../axios/member/response/auth/sign-in.response.dto.ts";
import { useCookies } from "react-cookie";


const Login_Main = () => {


  const idRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const [cookie, setCookie, removeCookie] = useCookies();

  const [id, setId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [wooRefreshToken, setWooRefreshToken] = useState<string>('');

  const [message, setMessage] = useState<string>('');

  const navigator = useNavigate();

  const params = useParams(); // useParams 사용

  const signInResponse = (responseBody: ResponseBody<SignInResponseDto>) => {

    if (!responseBody) return;

    const { code } = responseBody;
    if (code === ResponseCode.VALIDATION_FAIL) alert('아이디와 비밀번호를 입력하세요.');
    if (code === ResponseCode.SIGN_IN_FAIL) setMessage('로그인 정보가 일치하지 않습니다.');
    if (code === ResponseCode.DATABASE_ERROR) alert('데이터 베이스 오류입니다.');
    if (code !== ResponseCode.SUCCESS) return;

    const { token, refreshToken, expirationTime } = responseBody as SignInResponseDto;

    setWooRefreshToken(refreshToken);

    const now = new Date();
    const koreanTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
    const koreanTimeInMillis = koreanTime.getTime();
    const expires = new Date(koreanTimeInMillis + expirationTime);

    setCookie('accessToken', token, { expires, path: '/' });
    setCookie('refreshToken', refreshToken, { expires, path: '/', secure: true, httpOnly: true });
    setAccessTokenCookie(token, expirationTime);
    setRefreshTokenCookie(refreshToken)


    setTimeout(() => {
      removeCookie('accessToken', { path: '/' });
      console.log("엑세스 토큰이 만료되어 삭제되었습니다.");
      // 로그아웃 또는 다른 처리
      navigator('/login');
    }, expirationTime);

    console.log(expirationTime);
    console.log(expires);
    navigator(`/`);

  };

  // 리프레시 토큰 저장
  const setRefreshTokenCookie = (refreshToken) => {
    document.cookie = `refreshToken=${refreshToken}; path=/; secure`;
  };

  // 엑세스 토큰 저장
  const setAccessTokenCookie = (accessToken, expirationTime) => {
    // const expires = new Date(Date.now() + expirationTime);
    const now = new Date();
    const koreanTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
    const koreanTimeInMillis = koreanTime.getTime();
    const expires = new Date(koreanTimeInMillis + expirationTime);
    console.log("//" + now);
    console.log(koreanTime);
    console.log(koreanTimeInMillis);
    console.log("//" + expires);
    document.cookie = `accessToken=${accessToken}; path=/; expires=${expires}; secure`;
  };
  // expires=${expires.toUTCString()};

  const onIdChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setId(value);
  };
  const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPassword(value);
  };

  const onSignInButtonClickHandler = () => {

    if (!id || !password) {
      alert('아이디와 비밀번호 모두 입력하세요.')
      return;
    }
    const requestBody: SignInRequestDto = { id, password };
    signInRequest(requestBody).then(signInResponse);
  };


  const onIdKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    if (!passwordRef.current) return;
    passwordRef.current.focus();
  };
  const onPasswordKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    onSignInButtonClickHandler();

  };



  return (
    <>
      <div className="Login_Main">

        <div className="logo">
        </div>

        <div className="sign-in-content-inputbox">
          <InputBox ref={idRef} title="" placeholder="아이디를 입력해주세요." type="text" value={id} message="" onChange={onIdChangeHandler} onKeydown={onIdKeyDownHandler} />
          <InputBox ref={passwordRef} title="" placeholder="비밀번호를 입력해 주세요." type="password" value={password} onChange={onPasswordChangeHandler} isErrorMessage message={message} onKeydown={onPasswordKeyDownHandler} />
        </div>


        <div className="Login_butten">
          <div className="login" onClick={onSignInButtonClickHandler}>{'로그인'}</div>
        </div>



        <div className="line"></div>

        <div className="Login_a">
          <a href="/Find_by_ID"> 아이디 찾기 </a>|
          <a href="/Find_by_PW"> 비밀번호 찾기 </a>|
          <a href="/Choice_Membership"> 회원가입 </a>
        </div>
      </div>
    </>
  );
};

export default Login_Main;