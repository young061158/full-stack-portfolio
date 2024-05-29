import React, { ChangeEvent, useState, useRef, KeyboardEvent, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { checkCertificationRequest, emailCertificationRequest, idCheckRequest, signUpRequest } from "../../axios/MemberAxios.ts";
import InputBox from "../../components/Login/Input.tsx";
import IdCheckRequestDto from "../../axios/member/request/auth/id-check.request.dto.ts";
import IdCheckResponseDto from "../../axios/member/response/auth/id-check.response.dto.ts";
import ResponseDto from "../../axios/member/response/respons.dto.ts";
import ResponseCode from "../../axios/types/enums/response-code.enum.ts";
import EmailCertificationRequestDto from "../../axios/member/request/auth/email-certification.request.dto.ts";
import EmailCertificationResponseDto from "../../axios/member/response/auth/email-certification.response.dto.ts";
import { ResponseBody } from "../../axios/types/index.ts";
import CheckCertificationRequestDto from "../../axios/member/request/auth/check-certification.request.dto.ts";
import CheckCertificationResponseDto from "../../axios/member/response/auth/check-certification.response.dto.ts";
import SignUpRequestDto from "../../axios/member/request/auth/sign-up.request.dto.ts";
import SignUpResponseDto from "../../axios/member/response/auth/sign-up.response.dto.ts";
import UserAddress from "../../components/Login/UserAddress.jsx";
import popupDom from "../../data/PopupDom.jsx";
import { YEAR, MONTH, DAY } from "../../data/Time.js";


const Join_Membership_main = () => {

  const idRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const usernameRef = useRef<HTMLInputElement | null>(null);
  const passwordCheckRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const certificationNumberRef = useRef<HTMLInputElement | null>(null);

  const [id, setId] = useState<string>('');
  const [username, setUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordCheck, setpasswordCheck] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [certificationNumber, setCertificationNumber] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [subaddress, setSubaddress] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [useryear, setUserYear] = useState<string>('');
  const [usermonth, setUserMonth] = useState<string>('');
  const [userday, setUserDay] = useState<string>('');
  const [birthday, setBirthday] = useState<string>('');

  const [isIdError, setIdError] = useState<boolean>(false);
  const [isUserNameError, setUserNameError] = useState<boolean>(false);
  const [isPasswordError, setPasswordError] = useState<boolean>(false);
  const [isPasswordCheckError, setPasswordCheckError] = useState<boolean>(false);
  const [isEmailError, setEmailError] = useState<boolean>(false);
  const [isCertificationNumberError, setCertificationNumberError] = useState<boolean>(false);
  const [readOnly, setReadOnly] = useState<boolean>(false);

  const [idMessage, setIdMessage] = useState<string>('');
  const [userNameMessage, setUserNameMessage] = useState<string>('');
  const [passwordMessage, setPasswordMessage] = useState<string>('');
  const [passwordCheckMessage, setPasswordCheckMessage] = useState<string>('');
  const [emailMessage, setEmailMessage] = useState<string>('');
  const [certificationNumberMessage, setCertificationNumberMessage] = useState<string>('');

  const [isIdCheck, setIdCheck] = useState<boolean>(false);
  const [isCertificationCheck, setCertificationCheck] = useState<boolean>(false);


  const signUpButtonClass = id && username && password && passwordCheck && email && certificationNumber
    && useryear && usermonth && userday && gender ?
    'primary-button-lg' : 'disable-button-lg';

  const usernamePattern = /^[a-zA-Z가-힣]{2,14}$/;
  const emailPattern = /^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  const passwordPattern = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/;

  const navigator = useNavigate();

  const idCheckResponse = (responseBody: IdCheckResponseDto | ResponseDto | null) => {
    if (!responseBody) return;
    const { code } = responseBody;
    if (code === ResponseCode.VALIDATION_FAIL) alert('아이디를 입력하세요.');
    if (code === ResponseCode.DUPLICATE_ID) {
      setIdError(true);
      setIdMessage('이미 사용중인 아이디 입니다.');
      setIdCheck(false);
    }
    if (code === ResponseCode.DATABASE_ERROR) alert('데이터 베이스 오류입니다.');
    if (code !== ResponseCode.SUCCESS) return;

    setIdError(false);
    setIdMessage('사용 가능한 아이디 입니다.');
    setIdCheck(true);
  };

  const emailCertificationResponse = (responseBody: ResponseBody<EmailCertificationResponseDto>) => {

    if (!responseBody) return;
    const { code } = responseBody;
    if (code === ResponseCode.VALIDATION_FAIL) alert('아이디와 이메일을 모두 입력하세요.');
    if (code === ResponseCode.DUPLICATE_ID) {
      setIdError(true);
      setIdMessage('이미 사용중인 아이디 입니다.');
      setIdCheck(false);
    }
    if (code === ResponseCode.MAIL_FAIL) alert('이메일 전송에 실패했습니다.')
    if (code === ResponseCode.DATABASE_ERROR) alert('없는 이메일 입니다.');
    if (code !== ResponseCode.SUCCESS) return;

    setEmailError(false);
    setEmailMessage('인증번호가 전송되었습니다.');

  }

  //이메일 인증번호 확인
  const checkCertificationResponse = (responseBody: ResponseBody<CheckCertificationResponseDto>) => {
    if (!responseBody) return;

    const { code } = responseBody;
    if (code === ResponseCode.VALIDATION_FAIL) alert('아이디,이메일 , 인증번호를 모두 입력하세요.');
    if (code === ResponseCode.CERTIFICATION_FAIL) {
      setCertificationNumberError(true);
      setCertificationNumberMessage('인증번호가 일치하지 않습니다.');
      setCertificationCheck(false);
    }
    if (code === ResponseCode.DATABASE_ERROR) alert('데이터베이스 오류입니다.');
    if (code !== ResponseCode.SUCCESS) return;
    setCertificationNumberError(false);
    setCertificationNumberMessage('인증번호가 확인 되었습니다.');
    setCertificationCheck(true);
    setReadOnly(true);
  }

  const signUpResponse = (responseBody: ResponseBody<SignUpResponseDto>) => {

    if (!responseBody) return;

    const { code } = responseBody;
    if (code === ResponseCode.VALIDATION_FAIL) alert('필수 입력 값을 입력하세요.');
    if (code === ResponseCode.DUPLICATE_ID) {
      setIdError(true);
      setIdMessage('이미 사용중인 아이디 입니다.');
      setIdCheck(false);
    }
    if (code === ResponseCode.CERTIFICATION_FAIL) {
      setCertificationNumberError(true);
      setCertificationNumberMessage('인증번호가 일치하지 않습니다.');
      setCertificationCheck(false);
    }
    if (code === ResponseCode.DATABASE_ERROR) alert('데이터베이스 오류입니다.');
    if (code !== ResponseCode.SUCCESS) return;

  }


  const onIdChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setId(value);
    setIdMessage('');
    setIdCheck(false)
  };
  const onUserNameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setUserName(value);
    setUserNameMessage('');
  };
  const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPassword(value);
    setPasswordMessage('');
  };
  const onPasswordCheckChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setpasswordCheck(value);
    setPasswordCheckMessage('');
  };
  const onEmailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setEmail(value);
    setEmailMessage('');
  };
  const onCertificationChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setCertificationNumber(value);
    setCertificationNumberMessage('');
    setCertificationCheck(false);
  };

  const onIdButtonClickHandler = () => {
    if (!id) return;
    const requestBody: IdCheckRequestDto = { id };
    idCheckRequest(requestBody).then(idCheckResponse)
  }
  const onEmailButtonClickHandler = () => {
    if (!id || !email) return;

    const ckeckedEmail = emailPattern.test(email);
    if (!ckeckedEmail) {
      setEmailError(true);
      setEmailMessage('이메일 형식이 아닙니다.');
      return;
    }
    const requestBody: EmailCertificationRequestDto = { id, email };
    emailCertificationRequest(requestBody).then(emailCertificationResponse)
    setEmailError(false);
    setEmailMessage('이메일 전송중...');
  }

  const onCertificationNumberButtonClickHandler = () => {

    if (!id || !email || !certificationNumber) return;

    const requestBody: CheckCertificationRequestDto = { id, email, certificationNumber };
    checkCertificationRequest(requestBody).then(checkCertificationResponse)

  }

  // const onSignInButtonClickHandler = () => {
  //     navigator("/Join_Membership_finish");

  // }

  useEffect(() => {
    const paddedMonth = usermonth.toString().padStart(2, '0');
    const paddedDay = userday.toString().padStart(2, '0');
    setBirthday(paddedMonth + "." + paddedDay);
  }, [usermonth, userday]);




  const onSignUpButtonClickHandler = () => {
    if (!email || !username || !password || !passwordCheck || !email || !certificationNumber || !gender
      || !useryear || !usermonth || !userday
    ) return;
    if (!isIdCheck) {
      alert('중복 확인은 필수입니다.');
      return;
    }

    const checkedUserName = usernamePattern.test(username);
    if (!checkedUserName) {
      setUserNameError(true);
      setUserNameMessage('올바른 이름을 입력해 주세요.');
      window.scrollTo(0, 150);
      return;
    }

    const checkedPassword = passwordPattern.test(password);
    if (!checkedPassword) {
      setPasswordError(true);
      setPasswordMessage('영문, 숫자 , 특수문자를 혼용하여 8 ~ 13자를 입력해 주세요. ');
      window.scrollTo(0, 160);
      return;
    }

    if (password !== passwordCheck) {
      setPasswordCheckError(true);
      setPasswordCheckMessage('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!isCertificationCheck) {
      alert('이메일 인증은 필수입니다.')
      return;
    }


    const requestBody: SignUpRequestDto =
      { id, username, password, email, certificationNumber, gender, useryear, birthday, address, subaddress };
    signUpRequest(requestBody).then(signUpResponse);
    console.log(id, username, password, email, certificationNumber, gender, useryear, birthday, address, subaddress)
    navigator("/Join_Membership_finish");
  }


  const onIdKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    onIdButtonClickHandler();
  }
  const onUserNameKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    onIdButtonClickHandler()
    if (passwordRef.current) {
      passwordRef.current.focus(); // Move focus to the password input
    }
  }

  const onPasswordKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    if (!passwordCheckRef.current) return;
    passwordCheckRef.current.focus();
  }
  const onPasswordCheckKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    if (!emailRef.current) return;
    emailRef.current.focus();
  }
  const onEmailKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    onEmailButtonClickHandler();
  }
  const onCertificationNumberKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    onCertificationNumberButtonClickHandler();

  }

  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const openPostCode = () => {
    setIsPopupOpen(true)
  }
  const closePostCode = () => {
    setIsPopupOpen(false)
  }


  const handleAddressChange = (newAddress) => {
    setAddress(newAddress);
  };


  const handleRadioChange = (event) => {
    setGender(event.target.value);
  }

  const subaddressHandler = (event) => {
    setSubaddress(event.target.value);
  }
  //년도 선택
  const handleYearChange = (event) => {
    setUserYear(event.target.value);
  };

  // 월 선택 시 동작할 함수
  const handleMonthChange = (event) => {
    setUserMonth(event.target.value);
  };

  // 일 선택 시 동작할 함수
  const handleDayChange = (event) => {
    setUserDay(event.target.value);
  };



  return (
    <div className="Join2_Membership">
      <div className="img">
      </div>
      <div className="Join_Main">
        <div className="sign-up-wrapper">
          <div className="text_1"> 필수 입력 </div>
          <div className="lien"></div>
          <div className="sign-up-content-inputbox">
            <InputBox ref={idRef} title="아이디" placeholder="아이디를 입력해주세요." type="text" value={id} onChange={onIdChangeHandler} isErrorMessage={isIdError} message={idMessage} buttonTitle="중복확인" onButtonClick={onIdButtonClickHandler} onKeydown={onIdKeyDownHandler} />
            <InputBox ref={usernameRef} title="이름" placeholder="이름을 입력해 주세요." type="text" value={username} onChange={onUserNameChangeHandler} isErrorMessage={isUserNameError} message={userNameMessage} onKeydown={onUserNameKeyDownHandler} />
            <InputBox ref={passwordRef} title="비밀번호" placeholder="비밀번호를 입력해 주세요." type="password" value={password} onChange={onPasswordChangeHandler} isErrorMessage={isPasswordError} message={passwordMessage} onKeydown={onPasswordKeyDownHandler} />
            <InputBox ref={passwordCheckRef} title="비밀번호 확인" placeholder="비밀번호를 입력해 주세요." type="password" value={passwordCheck} onChange={onPasswordCheckChangeHandler} isErrorMessage={isPasswordCheckError} message={passwordCheckMessage} onKeydown={onPasswordCheckKeyDownHandler} />
            <InputBox ref={emailRef} title="이메일" placeholder="이메일 주소를 입력해 주세요." type="text" value={email} onChange={onEmailChangeHandler} isErrorMessage={isEmailError} message={emailMessage} buttonTitle="이메일 인증" onButtonClick={onEmailButtonClickHandler} onKeydown={onEmailKeyDownHandler} isReadOnly={readOnly} />
            <InputBox ref={certificationNumberRef} title="이메일 확인" placeholder="인증번호 4자리를 입력해 주세요." type="text" value={certificationNumber} onChange={onCertificationChangeHandler} isErrorMessage={isCertificationNumberError} message={certificationNumberMessage} buttonTitle="인증 확인" onButtonClick={onCertificationNumberButtonClickHandler} onKeydown={onCertificationNumberKeyDownHandler} />
            <form>
              <div className="join_text_all">성별</div>
              <fieldset>
                <label>
                  <input type="radio" name="gnder" value="남"
                    onChange={handleRadioChange} />
                  <span>남자</span>
                </label>

                <label>
                  <input type="radio" name="gnder" value="여"
                    onChange={handleRadioChange} />
                  <span>여자</span>
                </label>
              </fieldset>
              {/* 연도 선택 */}
              <div className="join_text_all">생일</div>
              <label htmlFor="year">연도 :</label>
              <select value={useryear} onChange={handleYearChange}>
                <option value="" disabled style={{ color: 'gray' }}>선택</option>
                {YEAR.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              <label htmlFor="month">월 :</label>
              <select value={usermonth} onChange={handleMonthChange}>
                <option value="" disabled style={{ color: 'gray' }}>선택</option>
                {MONTH.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>

              <label htmlFor="day">일 :</label>
              <select value={userday} onChange={handleDayChange}>
                <option value="" disabled style={{ color: 'gray' }}>선택</option>
                {DAY.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>

              <div className="text_1"> 선택 입력 </div>
              <div className="lien"></div>
              <div className="join_text_all">주소</div>

              <div className="address_box">
                <div className="address_search">
                  <input value={address} id="address" type="text" readOnly />
                  <button className="address_butten" style={{
                    transform: "translateY(0)",
                    top: "14px"
                  }} type='button' onClick={openPostCode}>주소검색</button>
                </div>
                <input className="subaddress" value={subaddress} type="text" placeholder='상세주소 입력' onChange={subaddressHandler} />
              </div>
            </form>

          </div>
        </div>
      </div>
      <div className="sign-up-content-button-box">
        <div className={signUpButtonClass} onClick={onSignUpButtonClickHandler}>{'회원가입'} </div>
      </div>

      <div className="footer_butten">
        {/* <button className="btn-success" onClick={saveOrUpdateEmployee}>
          가입 완료
        </button> */}

      </div>

      {isPopupOpen && (
        <div className="modal-address">
          <popupDom>
            <UserAddress onClose={closePostCode} onAddressSelect={handleAddressChange} />
          </popupDom>
        </div>
      )}
    </div>

  );
};


export default Join_Membership_main;
