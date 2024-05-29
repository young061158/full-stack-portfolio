import React, { useState, useEffect } from "react";
import axios from "axios";
import Logo from "../assets/img/logo2/logoMain.png";
import { ReactComponent as SearchIcon } from "../assets/img/input/inputbutten.svg"; // 검색 버튼 아이콘으로 변경
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import { FindUserResponseDto, NewTokenResponseDto, SignInResponseDto } from "../axios/member/response/auth";
import { ResponseBody } from "../axios/types/index.ts";
import ResponseCode from "../axios/types/enums/response-code.enum.ts"
import { FindUserRequestDto, NewTokenRequestDto } from "../axios/member/request/auth";
import { findUserRequest } from "../axios/MemberAxios.ts";
import { newToken } from "../axios/MemberAxios.ts";

const Header = () => {
  const navigator = useNavigate();

  const [cookies, setCookie, removeCookie] = useCookies();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string>('');
  const [testToken, setTestToken] = useState("");
  const [refreshTokenwoo, setRefreshToken] = useState("");
  const [id, setId] = useState("");
  const [userId, setUserId] = useState("");
  const [tokenTime, setTokenTime] = useState("");
  const [usertype, setUserType] = useState("");
  const [userAdmin, setUserAdmin] = useState(false);


  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const accessToken = searchParams.get('access_token');
  const refreshToken = searchParams.get('refreshtoken');

  const findUserResponse = (ResponseBody: ResponseBody<FindUserResponseDto>) => {
    if (!ResponseBody) return;
    const { code, id, username, userId, type, role } = ResponseBody;
    // if (code === ResponseCode.SIGN_IN_FAIL) alert("등록되지 않은 사용자 입니다.")
    if (code === ResponseCode.SUCCESS) {
      if (username !== undefined) {
        setUsername(username)
      }
      if (id !== undefined) {
        setId(id);
        setUserId(id);
      }
      if (type !== undefined) {
        setUserType(type);
      }
      if (role === "ROLE_ADMIN") {
        setUserAdmin(true);
      }
    }
  }

  //==============토큰 만료

  const newTokenresponse = (responseBody: ResponseBody<NewTokenResponseDto>) => {

    if (!responseBody) return;

    const { code } = responseBody;
    if (code === ResponseCode.VALIDATION_FAIL) alert('로그아웃 되었습니다????.');
    if (code === ResponseCode.DATABASE_ERROR) alert('로그아웃 되었습니다!!!!.');
    if (code !== ResponseCode.SUCCESS) return;

    const { token, refreshToken, expirationTime } = responseBody as NewTokenResponseDto;

    const now = (new Date().getTime()) * 1000;
    const expires = new Date(now + expirationTime);

    setCookie('accessToken', token, { expires, path: '/' });
    setCookie('refreshToken', refreshToken, { expires, path: '/', secure: true, httpOnly: true });
    setAccessTokenCookie(refreshToken, expirationTime);
    setRefreshTokenCookie(refreshToken)

    navigator(`/`);

  };

  const setRefreshTokenCookie = (refreshToken) => {
    document.cookie = `refreshToken=${refreshToken}; path=/; secure`;
    console.log(">>>>>>>>>>>>>>>>" + refreshToken)
  };
  // 엑세스 토큰 저장
  const setAccessTokenCookie = (accessToken, expirationTime) => {
    const expires = new Date(Date.now() + expirationTime * 1000);
    setTokenTime(expirationTime);
    document.cookie = `accessToken=${accessToken}; expires=${expires.toUTCString()}; path=/; secure`;
    console.log(">>>>>>>>>>>>>>>>" + expirationTime)
  };

  const newTokenCall = () => {
    setUserId(id);
  }
  //==============토큰 만료 ======

  useEffect(() => {
    const token = cookies.accessToken;
    const refresh_token = cookies.refreshToken;
    newTokenCall();
    setIsLoggedIn(!!token);
    setTestToken(token);
    if (refresh_token) {
      setRefreshToken(refresh_token);
    }
    const requestBody: FindUserRequestDto = { token };
    findUserRequest(requestBody).then(findUserResponse);
    if (accessToken == null) {
    }
  }, [cookies]);

  const handleLogout = () => {
    removeCookie('accessToken', { path: '/' });
    removeCookie('refreshToken', { path: '/' });
    setUserAdmin(false);
    window.location.reload();
    setIsLoggedIn(false);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    navigate(`/search/${searchTerm}`);
    setSearchTerm("");
  };

  const re_lgoin = () => {
    console.log("zz")
    const refresh_token = cookies.refreshToken;
    if (refresh_token !== undefined) {
      const requestBody: NewTokenRequestDto = { refreshTokenwoo };
      newToken(requestBody).then(newTokenresponse);
    }
  }

  return (
    <div className="header_All">
      <div className="header_header">

        {(isLoggedIn && usertype === "app") ? (
          <div className="login-signup">
            <div className="UserName">
              <p>
                {username} <span>님</span>{refreshToken}
              </p>
            </div>


            <Link className="navbar-brand" to={"/"} onClick={handleLogout}>
              로그아웃
            </Link>
            <Link className="navbar-brand" to={"/My_Page"}>
              마이페이지
            </Link>


          </div>
        ) : (
          <div className="login-signup">
            <Link className="navbar-brand" to={"/Login"} onClick={re_lgoin}>
              로그인
            </Link>
            <Link className="navbar-brand" to={"/Choice_Membership"}>
              회원가입
            </Link>
          </div>
        )}
      </div>

      <div className="header_body">
        <div className="logo_search">
          <div className="logo">
            <Link className="navbar-brand" to={"/"}>
              <img src={Logo} alt="Logo" />
            </Link>
          </div>
          {/* 
          <div className="token" >
          <p>Access Token: {testToken}</p>
            <br></br>
            <h2>===================</h2>
          <p>Refresh Token: {refreshTokenwoo}</p>
          </div> */}

          <div className="search-bar">
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="search-button">
                <SearchIcon />
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="header_footer">
        <div className="nav">
          <ul>
            {/* 각 카테고리에 해당하는 Link 컴포넌트 추가 */}
            <li>
              <Link className="navbar-brand" to={"/category/연극"}>
                연극
              </Link>
            </li>
            <li>
              <Link className="navbar-brand" to={"/category/뮤지컬"}>
                뮤지컬
              </Link>
            </li>
            <li>
              <Link className="navbar-brand" to={"/category/콘서트"}>
                콘서트
              </Link>
            </li>
            <li>
              <Link className="navbar-brand" to={"/category/클래식"}>
                클래식
              </Link>
            </li>
            <li>
              <Link className="navbar-brand" to={"/category/아동"}>
                아동
              </Link>
            </li>
            <li>
              <Link className="navbar-brand_1" to={"/performance/add"}>
                공연 등록
              </Link>
            </li>
            {userAdmin && (
              <li>
                <Link className="navbar-brand_2" to={"/banner/upload"}>
                  배너 등록
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header; 