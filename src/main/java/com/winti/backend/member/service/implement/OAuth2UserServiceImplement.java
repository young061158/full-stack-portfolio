package com.winti.backend.member.service.implement;

import com.winti.backend.member.entity.CustomOAuth2User;
import com.winti.backend.member.entity.UserEntity;
import com.winti.backend.member.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jdk.swing.interop.SwingInterOpUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class OAuth2UserServiceImplement extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest request) throws OAuth2AuthenticationException {

        OAuth2User oAuth2User = super.loadUser(request);
        //어디서 로그인 했는가 클라이언트 이름 가져오기
        String oauthClientName = request.getClientRegistration().getClientName();

        try{
            System.out.println(new ObjectMapper().writeValueAsString(oAuth2User.getAttributes()));
        }catch (Exception exception){
            exception.printStackTrace();
        }

        //어디서 로그인했냐?
        UserEntity userEntity = null;
        String userId = null;

        if(oauthClientName.equals("kakao")){
            userId = "" + oAuth2User.getAttributes().get("id");
            Map<String, Object> attributes = oAuth2User.getAttributes();
            Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
            String name = (String) kakaoAccount.get("name");
            String email = (String) kakaoAccount.get("email");
            String gender = (String) kakaoAccount.get("gender");
            if (gender.equals("male")){
                gender = "남";
            }else {
                gender = "여";
            }
            String birthday = (String) kakaoAccount.get("birthday");
            birthday = birthday.substring(0, 2) + "." + birthday.substring(2, 4);
            String birthyear = (String) kakaoAccount.get("birthyear");
            userEntity = new UserEntity(userId ,name , email , "kakao"
                    , gender , birthyear , birthday);

        }
        //userId = "naver_"+ responseMap.get("id").substring(0,14);
        if(oauthClientName.equals("naver")){
            Map<String , String> responseMap = (Map<String , String>) oAuth2User.getAttributes().get("response");
 //           userId = "naver_"+ responseMap.get("id");
            userId = responseMap.get("id");
            String name = (String) responseMap.get("name");
            String email = responseMap.get("email");
            String gender = (String)responseMap.get("gender");
            if (gender.equals("M")){
                gender = "남";
            }else {
                gender = "여";
            }
            String birthyear=(String)responseMap.get("birthyear");
            String birthday =(String)responseMap.get("birthday");
            birthday = birthday.replace("-", ".");

            userEntity = new UserEntity(userId ,name , email , "naver"
                    , gender , birthyear , birthday );


//            userEntity = new UserEntity(userId, email , "naver");
            userRepository.save(userEntity);
        }

        userRepository.save(userEntity);

        return new CustomOAuth2User(userId);
    }


}
