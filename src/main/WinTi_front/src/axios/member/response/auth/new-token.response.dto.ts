import ResponseDto from "../respons.dto";

export default interface NewTokenResponseDto extends ResponseDto{

    token : string;
    refreshToken : string;
    expirationTime: number;


}