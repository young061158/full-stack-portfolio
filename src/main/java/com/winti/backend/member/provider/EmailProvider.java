package com.winti.backend.member.provider;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EmailProvider {

    private final JavaMailSender javaMailSender;



    public boolean sendCertificationMail(String email , String certificationNumber){

        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper messageHelper = new MimeMessageHelper(message, true);

            if(certificationNumber.length() == 4 ){
                String SUBJECT = "[WinTi] 인증 회원가입 이메일 인증 메일 입니다.";
            String htmlContent = getCertificationMessage(certificationNumber);
            messageHelper.setFrom("[WinTi]<dnehdrbs10@gmail.com>");
            messageHelper.setTo(email);
            messageHelper.setSubject(SUBJECT);
            messageHelper.setText(htmlContent , true);
            }else {
                String SUBJECT = "[WinTi] 비밀번호 재발급 이메일 입니다.";
                String htmlContent = getPwCertificationMessage(certificationNumber);
                messageHelper.setFrom("[WinTi]<dnehdrbs10@gmail.com>");
                messageHelper.setTo(email);
                messageHelper.setSubject(SUBJECT);
                messageHelper.setText(htmlContent , true);
            }


            javaMailSender.send(message);

        }catch (Exception exception){
            exception.printStackTrace();
            return false;
        }
        return true;

    }

    private String getCertificationMessage(String certificationNumber){
        String certificationMessage = "";

//        certificationMessage += "<h1 style='text-align:center;'>[WinTi 인증 메일 서비스 ] 인증 메일</h1>";
//        certificationMessage += "<h3 style='text-align:center;'>인증 코드: <span style='font-size:32px; letter-spacing:8px;'>" + certificationNumber + "</span></h3>";

        certificationMessage += "<div style='background-color:#f2f2f2; border-radius: 10px; padding: 20px; width: 70%; margin: 0 auto;'>";
        certificationMessage += "<h1 style='text-align:center; color:#007bff; font-family: Arial, sans-serif;'>[WinTi 인증 메일 서비스] 인증 메일</h1>";
        certificationMessage += "<p style='text-align:center; color:#333; font-size:18px; font-family: Arial, sans-serif;'>아래 인증 코드를 사용하여 인증을 완료해주세요.</p>";
        certificationMessage += "<h2 style='text-align:center; color:#28a745; font-family: Arial, sans-serif;'>인증 코드: <span style='font-size:24px; letter-spacing:4px;'>" + certificationNumber + "</span></h2>";
        certificationMessage += "</div>";
        return certificationMessage;
    }

    private String getPwCertificationMessage(String certificationNumber){
        String certificationMessage = "";

//        certificationMessage += "<h1 style='text-align:center;'>[WinTi 인증 메일 서비스 ] 인증 메일</h1>";
//        certificationMessage += "<h3 style='text-align:center;'>인증 코드: <span style='font-size:32px; letter-spacing:8px;'>" + certificationNumber + "</span></h3>";

        certificationMessage += "<div style='background-color:#f2f2f2; border-radius: 10px; padding: 20px; width: 70%; margin: 0 auto;'>";
        certificationMessage += "<h1 style='text-align:center; color:#007bff; font-family: Arial, sans-serif;'>[WinTi 인증 메일 서비스] 비밀번호 인증 메일</h1>";
        certificationMessage += "<p style='text-align:center; color:#333; font-size:18px; font-family: Arial, sans-serif;'>아래 인증 코드를 사용하여 인증을 완료해주세요.</p>";
        certificationMessage += "<h2 style='text-align:center; color:#28a745; font-family: Arial, sans-serif;'>인증 코드: <span style='font-size:24px; letter-spacing:4px;'>" + certificationNumber + "</span></h2>";
        certificationMessage += "</div>";
        return certificationMessage;
    }

}
