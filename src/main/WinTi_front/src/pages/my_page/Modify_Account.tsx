import React, { ChangeEvent, useState, useRef, KeyboardEvent, useEffect } from "react";
import { ResponseBody } from '../../axios/types';
import { FindUserResponseDto, ModifyUserResponseDto } from '../../axios/member/response/auth';
import ResponseCode from "../../axios/types/enums/response-code.enum.ts";
import { useCookies } from "react-cookie";
import FindUserRequestDto from "../../axios/member/request/auth/find-user.dto.ts";
import { findUserRequest, modifyuser } from "../../axios/MemberAxios.ts";
import InputBox from "../../components/Login/Input.tsx";
import UserAddress from "../../components/Login/UserAddress.jsx";
import ResponseDto from "../../axios/member/response/respons.dto.ts";
import ModifyUserRequestDto from "../../axios/member/request/auth/modify-user.request.dto.ts";
import { useNavigate } from "react-router-dom";


const Modify_Account = () => {

  const passwordRef = useRef<HTMLInputElement | null>(null);
  const passwordCheckRef = useRef<HTMLInputElement | null>(null);

  const [isPasswordError, setPasswordError] = useState<boolean>(false);
  const [isPasswordCheckError, setPasswordCheckError] = useState<boolean>(false);

  const [passwordMessage, setPasswordMessage] = useState<string>('');
  const [passwordCheckMessage, setPasswordCheckMessage] = useState<string>('');

  const [cookies, setCookie, removeCookie] = useCookies();
  const [id, setId] = useState<string>('');
  const [username, setUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordCheck, setpasswordCheck] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [subaddress, setSubaddress] = useState<string>('');
  const [useryear, setUserYear] = useState<string>('');
  const [birthday, setBirthday] = useState<string>('');
  const [testAddress, setTestAddress] = useState<string>('');
  const [testSubAddress, setTestSubAddress] = useState<string>('');

  const [modifyPassword, setModifyPassword] = useState<string>('');
  const [modifyPasswordCheck, setModifyPasswordCheck] = useState<string>('');
  const [modifyAddress, setModifyAddress] = useState<string>('');
  const [modifySubAddress, setModifySubAddress] = useState<string>('');

  const passwordPattern = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/;

  const navigator = useNavigate();

  const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setModifyPassword(value);
    if (value === "") {
      setPasswordMessage('');
    }
  };
  const onPasswordCheckChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setModifyPasswordCheck(value);
    if (value === "") {
      setPasswordCheckMessage('');
    }
  };


  const findUserResponse = (ResponseBody: ResponseBody<FindUserResponseDto>) => {
    if (!ResponseBody) return;
    const { code, id, username, email, useryear, birthday, address, subaddress } = ResponseBody;
    if (code === ResponseCode.SIGN_IN_FAIL) alert("등록되지 않은 사용자 입니다.")
    if (code === ResponseCode.SUCCESS) {
      if (username !== undefined) {
        setUserName(username);
        if (email) setEmail(email);
        if (useryear) setUserYear(useryear);
        if (birthday) setBirthday(birthday);
        if (address) setTestAddress(address);
        if (subaddress) setTestSubAddress(subaddress);
        if (id) setId(id);
      }
    }
  }

  useEffect(() => {
    const token = cookies.accessToken;
    const requestBody: FindUserRequestDto = { token };
    findUserRequest(requestBody).then(findUserResponse);
  }, [cookies.accessToken]);

  const onPasswordKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    if (!passwordCheckRef.current) return;
    passwordCheckRef.current.focus();
  }
  const onPasswordCheckKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    // if(!emailRef.current) return;
    // emailRef.current.focus();
  }



  const modifyuserResponse = (responseBody: ModifyUserResponseDto | ResponseDto | null) => {
    if (!responseBody) return;
    const { code } = responseBody;
    if (code === ResponseCode.VALIDATION_FAIL) {
      alert('비밀번호 또는 주소를 입력해야 합니다.');
      return;
    }
    if (code === ResponseCode.DUPLICATE_ID) {
      alert('데이터 오류입니다..');
      return;
    }

    if (code === ResponseCode.SUCCESS) navigator("/My_Page/Modify_End");
  };

  const onModifyHandler = () => {
    if (modifyPassword !== "") {
      const checkedPassword = passwordPattern.test(modifyPassword);
      if (!checkedPassword) {
        setPasswordError(true);
        setPasswordMessage('영문, 숫자 , 특수문자를 혼용하여 8 ~ 13자를 입력해 주세요. ');
        return;
      }

      if (modifyPassword !== modifyPasswordCheck) {
        setPasswordCheckError(true);
        setPasswordCheckMessage('비밀번호가 일치하지 않습니다.');
        return;
      }
    }
    const requestBody: ModifyUserRequestDto = { id, password, address, subaddress };
    modifyuser(requestBody).then(modifyuserResponse);
  }
  useEffect(() => {
    if (modifyAddress === "") {
      setAddress(testAddress);
    } else {
      setAddress(modifyAddress);
    }
    if (modifySubAddress === "") {
      setSubaddress(testSubAddress);
    } else {
      setSubaddress(modifySubAddress);
    }
  }, [modifyAddress, modifySubAddress])

  useEffect(() => {
    setPassword(modifyPassword)
  }, [modifyPassword])



  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const openPostCode = () => {
    setIsPopupOpen(true)
  }
  const closePostCode = () => {
    setIsPopupOpen(false)
  }

  const subaddressHandler = (event) => {
    setModifySubAddress(event.target.value);
  }

  const handleAddressChange = (newAddress) => {
    setModifyAddress(newAddress);
  };

  const okorno = modifyPassword || passwordCheck || modifyAddress || modifySubAddress ? "ok_butten" : "no_buutten";

  return (
    <div className='Modify_Account'>
      <div className='account_text'>개인정보 수정</div>

      <div className='user_account'>
        <div className='user_header'>
          <div className='user_name'><span>{username}</span>님</div>

        </div>
        <div className='lien'></div>

        <div className='user_emial'>이메일
          <div className='email'>{email} </div>
        </div>

        <div className='user_birthday'>생년월일
          <div className='birthday'>{useryear}.{birthday}</div>
        </div>

        <div className='lien'></div>

        <InputBox ref={passwordRef} title="비밀번호 수정" placeholder="비밀번호를 입력해 주세요." type="password" value={modifyPassword}
          onChange={onPasswordChangeHandler} isErrorMessage={isPasswordError} message={passwordMessage} onKeydown={onPasswordKeyDownHandler} />
        <InputBox ref={passwordCheckRef} title="비밀번호 확인" placeholder="비밀번호를 입력해 주세요." type="password" value={modifyPasswordCheck} onChange={onPasswordCheckChangeHandler}
          isErrorMessage={isPasswordCheckError} message={passwordCheckMessage} onKeydown={onPasswordCheckKeyDownHandler} />

        <form>
          <div className="address_box">
            <div className="address_text">주소 변경 (선택)</div>
            <div className="address_search">
              <input value={modifyAddress} id="address" type="text" placeholder={testAddress} readOnly />
              <button className="address_butten" style={{
                transform: "translateY(0)",
                top: "14px"
              }} type='button' onClick={openPostCode}>주소검색</button>
            </div>

            <div className="subaddress_text">상세 주소 (선택)</div>
            <input value={modifySubAddress} type="text" placeholder={testSubAddress} onChange={subaddressHandler} />
          </div>
        </form>
      </div>

      <div className={okorno} onClick={onModifyHandler}>수정 완료</div>

      {isPopupOpen && (
        <div className="modal">
          <popupDom>
            <UserAddress onClose={closePostCode} onAddressSelect={handleAddressChange} />
          </popupDom>
        </div>
      )}

    </div>

  )
}

export default Modify_Account