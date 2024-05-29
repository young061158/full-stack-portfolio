package com.winti.backend.member.common;

//이메일 보내는 랜덤

public class CertificationNumber {

    public static String getCertificationNumber(){

        String certificationNumber = "";

        for(int count = 0; count < 4; count++) certificationNumber += (int) (Math.random() * 10);

        return certificationNumber;
    }

    public static String getPasswordCertificationNumeber(){

        String passwordCertificationNumber = "";

        for(int count = 0; count < 6; count++) passwordCertificationNumber += (int) (Math.random() * 10);

        for(int count = 0; count < 4; count++)
            passwordCertificationNumber += (char) ('A' + Math.random() * 26);

        return passwordCertificationNumber;
    }
}
