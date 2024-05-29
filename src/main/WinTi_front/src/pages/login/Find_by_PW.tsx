import React , { ChangeEvent, useState , useRef , KeyboardEvent } from "react";

import { FindPwResponseDto } from "../../axios/member/response/auth";
import { ResponseDto } from "../../axios/member/response";
import ResponseCode from "../../axios/types/enums/response-code.enum.ts";
import InputBox from "../../components/Login/Input.tsx";
import userEvent from "@testing-library/user-event";
import FindPwRequestDto from "../../axios/member/request/auth/find-pw.request.dto.ts";
import { findPwRequest } from "../../axios/MemberAxios.ts";

const Find_by_PW = () => {

  const idRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);

  const[id , setId] = useState<string>('');
  const[email , setEmail] = useState<string>('');
  const[content , setContent] = useState<string>('');


  const find_pw_butten = id && email ? 'find_pw_butten_true' : 'find_pw_butten_false';

  const findPwResponse = (responseBody : FindPwResponseDto | ResponseDto | null) => {
    if(!responseBody) return;
    const {code} = responseBody;
    if(code === ResponseCode.VALIDATION_FAIL){
      alert('등록되지 않은 사용자 입니다.');
      setContent('')
    }
    if(code === ResponseCode.DUPLICATE_ID) {
      alert('등록되지 않은 사용자 입니다.');
      setContent('')
    }

    if(code !== ResponseCode.SUCCESS)return;
    setContent('메일로 임시 비밀번호 전송이 완료 되었습니다.')
  };

  const onFindPWbuttenHandler = () => {

    if(!id || !email){
      alert('아이디와 이메일을 모두 입력하세요.')
      return;
    }
    const requestBody: FindPwRequestDto = {id , email};
    findPwRequest(requestBody).then(findPwResponse);
    setContent('사용자 인증 확인중 ...')
  }

  const onIdChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const {value} = event.target;
    setId(value);
  };
  const onEmailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const {value} = event.target;
    setEmail(value);
  };


  const onIdKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    if(!emailRef.current) return;
    emailRef.current.focus();
  };
  const onPasswordKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    onFindPWbuttenHandler()
  };

  return (
    <div className="Find_by_PW">

      <h2>비밀번호 찾기</h2>
    
      <div className="Find_by_PW_form">
      <InputBox ref={idRef}  title="아이디" placeholder="아이디를 입력해주세요." type="text" value={id} message="" onChange={onIdChangeHandler}   onKeydown={onIdKeyDownHandler}/>
      <InputBox ref={emailRef}  title="이메일" placeholder="이메일을 입력해 주세요." type="text" value={email}  onChange={onEmailChangeHandler}   onKeydown={onPasswordKeyDownHandler}/>
      </div>

      <div className="span-mail">{content}</div>
      <div className={find_pw_butten} onClick={onFindPWbuttenHandler}>{`임시 비밀번호 발급받기`}</div>

      <div className="lien"></div>

      <div className="next">
        <a href="/Find_by_PW"> 회원가입 </a>
        <span>|</span>
        <a href="/Login"> 로그인 </a>
      </div>
    </div>
  );
};

export default Find_by_PW;
