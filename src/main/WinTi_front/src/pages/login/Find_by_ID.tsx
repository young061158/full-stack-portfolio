import React, { useRef, useState, ChangeEvent, KeyboardEvent } from "react";
import InputBox from "../../components/Login/Input.tsx";
import FindIdRequestDto from "../../axios/member/request/auth/find-id.request.dto.ts";
import { findIdRequest } from "../../axios/MemberAxios.ts";
import { ResponseBody } from "../../axios/types/index.ts";
import FindIdResponseDto from "../../axios/member/response/auth/find-id.response.dto.ts";
import ResponseDto from "../../axios/member/response/respons.dto.ts";
import ResponseCode from "../../axios/types/enums/response-code.enum.ts";

const Find_by_ID = () => {


  const usernameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);

  const [isEmailError, setEmailError] = useState<boolean>(false);

  const [username, setUserName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [ids, setIds] = useState<string[]>([]);

  const findIdButten = username && email ? `find-butten-true` : `find-butten-false`;

  const findIdResponse = (ResponseBody: ResponseBody<FindIdResponseDto>) => {
    if (!ResponseBody) return;
    const { code, userIds } = ResponseBody;
    if (code === ResponseCode.SIGN_IN_FAIL) alert("등록되지 않은 사용자 입니다.")
    if (code === ResponseCode.SUCCESS) {
      if (userIds) {
        setIds(userIds); // userId가 정의되어 있을 때만 setId 호출
      } else {
        setIds("")
        alert("등록되지 않은 사용자 입니다.");
      }
    }
  }

  const onFindButtonClickHandler = () => {
    if (!username || !email) {
      alert('이름 이메일 모두 입력하세요.')
      return;
    }
    const requestBody: FindIdRequestDto = { username, email };
    findIdRequest(requestBody).then(findIdResponse);
  }


  const onUserNameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setUserName(value);
  };

  const onEmailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setEmail(value);
  };

  const onusernameKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    emailRef.current?.focus();
  }

  const onemailKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    onFindButtonClickHandler();
  }

  const maskId = (userId: string): string => {
    return userId.replace(/(..)$/g, '**'); //뒷 부분 두 글자만 *로 바꿈
  };

  return (
    <div className="Find_by_ID">
      <h2>아이디 찾기</h2>
      <div className="Find_by_ID_form">
        <InputBox ref={usernameRef} title="이름" placeholder="이름을 입력해 주세요." type="text" value={username} onChange={onUserNameChangeHandler} onKeydown={onusernameKeyDownHandler} />
        <InputBox ref={emailRef} title="이메일" placeholder="이메일을 입력해 주세요." type="text" value={email} onChange={onEmailChangeHandler} onKeydown={onemailKeyDownHandler} />
      </div>
      <div className="find_id_butten">
        <div className={findIdButten} onClick={onFindButtonClickHandler}>{`아이디 찾기`}</div>
      </div>
      <div className="lien"></div>

      <div className="youer_ID">
        <p>당신의 아이디는</p>
        {ids.map((id, index) => (
          <p key={index} className="name">{maskId(id)}</p>
        ))}
        <p>입니다.</p>
      </div>

      <div className="next">
        <a href="/Find_by_PW"> 비밀번호 찾기 </a>
        <span>|</span>
        <a href="/Login"> 로그인 </a>
      </div>
    </div>
  );
};

export default Find_by_ID;