import ResponseDto from "../respons.dto";

export default interface SignInResponseDto extends ResponseDto{

    token : string;
    refreshToken : string;
    expirationTime: number;


}