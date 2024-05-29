package com.winti.backend.member.common;

public interface ResponseCode {

    String SUCCESS = "SU";
    //http status - 200 성공

    String VALIDATION_FAIL = "VF";
    //400 유효성검사 실패
    String DUPLICATE_ID = "DI";
    //400 중복 에러

    String SIGN_IN_FAIL = "SF";
    //401 로그인 실패
    String CERTIFICATION_FAIL = "CF";
    //401 인증 실패 메일

    String MAIL_FAIL = "MF";
    //500 메일 실패
    String DATABASE_ERROR = "DBE";
    //500 데이터베이스 연결문제
}
