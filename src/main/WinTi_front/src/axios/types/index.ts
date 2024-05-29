import { ResponseDto } from "../member/response";

type ResponseBody<T> = T | ResponseDto | null;


export type { ResponseBody, };
