import axios, { AxiosResponse } from 'axios';
import {ResponseDto} from './member/response';
import {CheckCertificationRequestDto, EmailCertificationRequestDto, IdCheckRequestDto, 
  SignInRequestDto, SignUpRequestDto , FindIdRequestDto , FindPwRequestDto , FindUserRequestDto
  ,ModifyUserRequestDto,
  NewTokenRequestDto , DisableUserRequestDto,
  SnsUserRequestDto
} from './member/request/auth/index';

import {CheckCertificationResponseDto, EmailCertificationResponseDto, IdCheckResponseDto ,
   SignInResponseDto, SignUpResponseDto , FindIdResponseDto , FindPwResponseDto , FindUserResponseDto
  , ModifyUserResponseDto,
  NewTokenResponseDto,
  DisableUserResponseDto,
  SnsUserResponseDto
  } from './member/response/auth';


const responseHeandler = <T> (response : AxiosResponse<any , any>) => {
  const responseBody: T = response.data;
  return responseBody;
};

const errorHandler = (error: any) => {
  if(!error.response || !error.response.data) return null;
  const responseBody: ResponseDto = error.response.data;
  return responseBody;
};


const REST_API_BASE_URL = "http://localhost:8080";

// 회원가입 아이디 중복 체크 
const ID_CHECK_URL = () => `${REST_API_BASE_URL}/user/id-check`;
// 이메일 확인
const EMAIL_CERTIFICATION_URL = () => `${REST_API_BASE_URL}/user/email-certification`;
//이메일 번호 확인
const CHECK_CERTIFICATION_URL = () => `${REST_API_BASE_URL}/user/check-certification`;
//회원가입 
const SIGN_UP_URL = () => `${REST_API_BASE_URL}/user/sign-up`;
//로그인
const SIGN_IN_URL = () => `${REST_API_BASE_URL}/user/sign-in`;
//sns 로그인
export const SNS_SIGN_IN_URL = (type:'kakao' | 'naver') => `${REST_API_BASE_URL}/oauth2/${type}?prompt=login`
//아이디 찾기
export const FIND_USER_ID = () => `${REST_API_BASE_URL}/user/find-id`
//비밀번호 찾기
const FIND_USER_PW = () => `${REST_API_BASE_URL}/user/find-pw`
//토큰으로 회원 정보 받아오기
export const Find_USER = () => `${REST_API_BASE_URL}/user/find-user`
//개인정보 수정하기
export const MODIFY_USER_URL =  () => `${REST_API_BASE_URL}/user/modify-user`
//토큰 만료되었을 때 새로운 토큰 발급받기
export const NEW_TOKEN_URL = () => `${REST_API_BASE_URL}/user/new-token`
//회원 비활성화 
export const DISABLE_USER_URL = () => `${REST_API_BASE_URL}/user/disable-user`
//sns 회원 전환
export const SNS_DISABLE_USER_URL = () => `${REST_API_BASE_URL}/user/snsmodify-user`


export const snsUser = async (requestBody : SnsUserRequestDto) => {
  const result = await axios.post(SNS_DISABLE_USER_URL(), requestBody)
  .then(responseHeandler<SnsUserResponseDto>)
  .catch(errorHandler);
  return result;
}


export const disableUser = async (requestBody : DisableUserRequestDto) => {
  const result = await axios.post(DISABLE_USER_URL(), requestBody)
  .then(responseHeandler<DisableUserResponseDto>)
  .catch(errorHandler);
  return result;
}

export const newToken = async (requestBody : NewTokenRequestDto) => {
  const result = await axios.post(NEW_TOKEN_URL(), requestBody)
  .then(responseHeandler<NewTokenResponseDto>)
  .catch(errorHandler);
  return result;
}

export const modifyuser = async (requestBody : ModifyUserRequestDto) => {
  const result = await axios.post(MODIFY_USER_URL(), requestBody)
  .then(responseHeandler<ModifyUserResponseDto>)
  .catch(errorHandler);
  return result;
}

export const findUserRequest = async (requestBody : FindUserRequestDto) => {
  const result = await axios.post(Find_USER(), requestBody)
  .then(responseHeandler<FindUserResponseDto>)
  .catch(errorHandler);
  return result;
}

export const findPwRequest = async (requestBody : FindPwRequestDto) => {
  const result = await axios.post(FIND_USER_PW(), requestBody)
  .then(responseHeandler<FindPwResponseDto>)
  .catch(errorHandler);
  return result;
}

export const findIdRequest = async (requestBody : FindIdRequestDto) => {
  const result = await axios.post(FIND_USER_ID(), requestBody)
  .then(responseHeandler<FindIdResponseDto>)
  .catch(errorHandler);
  return result;
}

export const signInRequest = async (requestBody: SignInRequestDto) => {
  const result = await axios.post(SIGN_IN_URL(), requestBody)
    .then(responseHeandler<SignInResponseDto>)
    .catch(errorHandler);
  return result;
}

export const signUpRequest = async (requestBody: SignUpRequestDto) => {
  const result = await axios.post(SIGN_UP_URL() , requestBody)
    .then(responseHeandler<SignUpResponseDto>)
    .catch(errorHandler);
    return result;
}

export const idCheckRequest = async (requestBody: IdCheckRequestDto) => {
  const result = await axios.post(ID_CHECK_URL(),requestBody )
  .then(responseHeandler<IdCheckResponseDto>)
  .catch(errorHandler)
  return result;
};

export const emailCertificationRequest = async (requestBody: EmailCertificationRequestDto) =>{
  const result = await axios.post(EMAIL_CERTIFICATION_URL() , requestBody)
    .then(responseHeandler<EmailCertificationResponseDto>)
    .catch(errorHandler);
    return result;
};

export const checkCertificationRequest = async (requestBody: CheckCertificationRequestDto) => {
  const result = await axios.post(CHECK_CERTIFICATION_URL(), requestBody)
    .then(responseHeandler<CheckCertificationResponseDto>)
    .catch(errorHandler);
    return result;
};



// export const createEmployee = (employee) =>
//   axios.post(REST_API_BASE_URL, employee);