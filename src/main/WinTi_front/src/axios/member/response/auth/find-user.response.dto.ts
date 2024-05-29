import ResponseDto from "../respons.dto";

export default interface FindUserResponseDto extends  ResponseDto{

    id: string;
    username: string;
    password: string;
    email: string;
    certificationNumber: string;
    gender: string;
    useryear: string;
    birthday : string;
    role? : string;
    type? : string;
    address?: string;
    subaddress?: string;
}
