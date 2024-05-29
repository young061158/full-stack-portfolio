package com.winti.backend.member.service.implement;


import com.winti.backend.member.common.CertificationNumber;
import com.winti.backend.member.dto.request.auth.*;
import com.winti.backend.member.dto.response.ResponseDto;
import com.winti.backend.member.dto.response.auth.*;
import com.winti.backend.member.entity.CertificationEntity;
import com.winti.backend.member.entity.RefreshToken;

import com.winti.backend.member.entity.SnsIdEntity;
import com.winti.backend.member.entity.UserEntity;
import com.winti.backend.member.provider.EmailProvider;
import com.winti.backend.member.provider.JwtProvider;
import com.winti.backend.member.repository.CertificationRepository;
import com.winti.backend.member.repository.SnsIdRepository;
import com.winti.backend.member.repository.TokenRepository;
import com.winti.backend.member.repository.UserRepository;
import com.winti.backend.member.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthServiceImplement implements AuthService {

    private final UserRepository userRepository;
    private final CertificationRepository certificationRepository;
    private final JwtProvider jwtProvider;
    private final TokenRepository tokenRepository;
    private final SnsIdRepository snsIdRepository;

    private final EmailProvider emailProvider;

    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public ResponseEntity<? super IdCheckResponseDto> idCheck(IdCheckRequestDto dto){

        try{
            String userId = dto.getId();
            boolean isExistId = userRepository.existsByUserId(userId);
            if(isExistId) return IdCheckResponseDto.duplicateId();

        }catch (Exception exception){
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }

        return IdCheckResponseDto.success();


    }

    @Override
    public ResponseEntity<? super EmailCertificationResponseDto> emailCertificaiton(EmailCertificationRequestDto dto) {

        try{

            String userId = dto.getId();
            String email = dto.getEmail();

            boolean isExistId = userRepository.existsByUserId(userId);
            if (isExistId) return EmailCertificationResponseDto.duplicateId();

            String certificationNumber = CertificationNumber.getCertificationNumber();

            boolean isSuccessed = emailProvider.sendCertificationMail(email , certificationNumber);
            if (!isSuccessed) return EmailCertificationResponseDto.mailSendFail();

            CertificationEntity certificationEntity = new CertificationEntity(userId , email , certificationNumber);
            certificationRepository.save(certificationEntity);

        }catch (Exception exception){
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }

        return EmailCertificationResponseDto.success();
    }

    @Override
    public ResponseEntity<? super CheckCertificationResponseDto> checkCertification(CheckCertificationRequestDto dto) {

        try{

            String userId = dto.getId();
            String email = dto.getEmail();
            String certificationNumber = dto.getCertificationNumber();

            CertificationEntity certificationEntity = certificationRepository.findByUserId(userId);
            if (certificationEntity == null) return CheckCertificationResponseDto.certificationFail();

            boolean isMatch = certificationEntity.getEmail().equals(email)
                    && certificationEntity.getCertificationNumber().equals(certificationNumber);

            if(!isMatch) return CheckCertificationResponseDto.certificationFail();


        }catch (Exception exception){
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }

        return CheckCertificationResponseDto.success();
    }

    @Override
    public ResponseEntity<? super SignUpResponseDto> signUp(SignUpRequestDto dto) {

        try{
            String userId = dto.getId();
            boolean isExistId = userRepository.existsByUserId(userId);
            if(isExistId) return SignUpResponseDto.duplicateId();

            String email = dto.getEmail();
            String certificationNumber = dto.getCertificationNumber();
            CertificationEntity certificationEntity = certificationRepository.findByUserId(userId);
            boolean isMatched = certificationEntity.getEmail().equals(email) &&
                    certificationEntity.getCertificationNumber().equals(certificationNumber);
            if (!isMatched) return SignUpResponseDto.certificationFail();

            String password = dto.getPassword();
            String encodedPassword = passwordEncoder.encode(password);
            dto.setPassword(encodedPassword);

            UserEntity userEntity = new UserEntity(dto);
            userRepository.save(userEntity);

            //certificationRepository.delete(certificationEntity);
            certificationRepository.deleteByUserId(userId);

        }catch (Exception exception){
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }

        return SignUpResponseDto.success();
    }

    @Transactional
    @Override
    public ResponseEntity<? super SnsModifyUserResponseDto> snsModifyUser(SnsModifyUserRequestDto dto) {

        try{
            String userId = dto.getUserId();
            boolean isExistId = snsIdRepository.existsByUserId(userId);
            if(isExistId) { return SnsModifyUserResponseDto.duplicateId();}else {
                SnsIdEntity snsIdEntity = new SnsIdEntity(userId);
                snsIdRepository.save(snsIdEntity);
            }
//            String newId = dto.getNewId();
//            String email = dto.getEmail();
//            String username = dto.getUsername();
            String password = dto.getPassword();
            String encodedPassword = passwordEncoder.encode(password);
            dto.setPassword(encodedPassword);
//            String gender = dto.getGender();
//            String useryear = dto.getBirthday();
//            String address = dto.getAddress();
//            String subaddress = dto.getSubaddress();
            UserEntity userEntity = new UserEntity(dto);
            userRepository.save(userEntity);

            //certificationRepository.delete(certificationEntity);
            certificationRepository.deleteByUserId(userId);

            userRepository.deleteByUserId(userId);

        }catch (Exception exception){
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return SnsModifyUserResponseDto.success();

    }

    @Override
    public ResponseEntity<? super SignInResponseDto> signIn(SignInRequestDto dto) {

        String token = null;
        String refreshtoken = null;
        try {

            String userId = dto.getId();
            UserEntity userEntity = userRepository.findByUserId(userId);
            if (userEntity == null) return SignInResponseDto.signInFail();
            Boolean disable = userEntity.isDisable();
            if (disable == true) return SignInResponseDto.signInFail();

            String password = dto.getPassword();
            String encodedPassword = userEntity.getPassword();
            boolean isMatched = passwordEncoder.matches(password, encodedPassword);
            if (!isMatched) return SignInResponseDto.signInFail();

            //토큰을 생성
            token = jwtProvider.create(userId);
            refreshtoken = jwtProvider.createRefreshToken(userId);

            RefreshToken token1 = new RefreshToken(refreshtoken); // 토큰 저장
            tokenRepository.save(token1);

        } catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return SignInResponseDto.success(token , refreshtoken);
    }



    @Override
    public ResponseEntity<? super DisableUserResponseDto> disableUser(DisableUserRequestDto dto) {

        try{
            String userId = dto.getUserId();
            UserEntity user = userRepository.findByUserId(userId);
            if(user == null) DisableUserResponseDto.duplicateId();
            user.disable();
            userRepository.save(user);

        }catch (Exception exception){
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return DisableUserResponseDto.success() ;
    }



    @Override
    public ResponseEntity<? super FindIdResponseDto> findId(FindIdRequestDto dto) {

        try {
            String username = dto.getUsername();
            String email = dto.getEmail();
            List<UserEntity> users = userRepository.findByUsernameAndEmail(username, email);

            if (users.isEmpty()) {
                return FindIdResponseDto.notfindId();
            }

            List<String> userIds = users.stream()
                    .map(UserEntity::getUserId)
                    .collect(Collectors.toList());
            return FindIdResponseDto.success(userIds);

        } catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
    }

    @Override
    public ResponseEntity<? super FindPasswordResponseDto> findPw(FindPasswordRequestDto dto) {

        try{
            String userId = dto.getId();
            String email = dto.getEmail();
            UserEntity user = userRepository.findByUserIdAndEmail(userId , email);
            if (user == null){return FindPasswordResponseDto.duplicateId();}
            if (!user.getEmail().equals(email)) {
                return FindPasswordResponseDto.validationFail(); // 이메일 유효성 검사 실패를 응답
            }
            //비밀번호 생성
            String certificationNumber = CertificationNumber.getPasswordCertificationNumeber();
            //비밀번호 수정
            String encodedPassword = passwordEncoder.encode(certificationNumber);
            user.changePassword(encodedPassword);
            userRepository.save(user);
            //메일 보내기
            boolean isSuccessed = emailProvider.sendCertificationMail(email , certificationNumber);
            // 메일 전송에 실패한 경우
            if (!isSuccessed) {
                return EmailCertificationResponseDto.mailSendFail(); // 메일 전송 실패를 응답하지만 그럴리없음
            }
        } catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError(); // 데이터베이스 에러 응답
        }
        return FindPasswordResponseDto.success();
    }

    @Override
    public ResponseEntity<? super FindUserResponseDto> findUser(FindUserRequestDto dto) {

        try{
           String userId = jwtProvider.extractUserId(dto.getToken());
           UserEntity user = userRepository.findByUserId(userId);

           if(user == null){
               return FindUserResponseDto.notfindUser();
           }

           return FindUserResponseDto.success(user);

        }catch (Exception exception){
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
    }
    @Override
    public ResponseEntity<? super NewTokenResponseDto> newToken(NewTokenRequestDto dto) {

        String token = null;
        String refreshtoken = null;

        try {

            String refreshTokenwoo = dto.getRefreshTokenwoo();
            String userId =jwtProvider.extractUserId(dto.getRefreshTokenwoo());

            RefreshToken refreshToken = tokenRepository.findByRefreshToken(refreshTokenwoo);
            if (refreshToken == null) return NewTokenResponseDto.signInFail();

            //토큰을 생성
            token = jwtProvider.create(userId);
            refreshtoken = jwtProvider.createRefreshToken(userId);

            RefreshToken token1 = new RefreshToken(refreshtoken); // 토큰 저장
            tokenRepository.save(token1);

        } catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return NewTokenResponseDto.success(token , refreshtoken);
    }

    @Override
    public ResponseEntity<? super ModifyUserResponseDto> modifyUser(ModifyUserRequestDto dto) {

        try {
            String id = dto.getId();
            String password = dto.getPassword();
            String address = dto.getAddress();
            String subaddress = dto.getSubaddress();

            UserEntity user = userRepository.findByUserId(id);
            if (user == null) {
                return ModifyUserResponseDto.validationFail();
            }

            String newPassword = passwordEncoder.encode(password);

            user.modifyUser(newPassword , address, subaddress);
            userRepository.save(user);

        }catch (Exception exception){
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }

        return ModifyUserResponseDto.success();
    }


}
