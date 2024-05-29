import { ResponseCode, ResponseMessage } from "../../types/enums";

export default interface ResponseDto{
    code: ResponseCode;
    message: ResponseMessage;
    userId?: string;
    id?: string;
    username?: string;
    password?: string;
    email?: string;
    gender?: string;
    useryear?: string;
    birthday?: string;
    address?: string;
    subaddress?: string;
}

// code:string;
// message:string;
