export default interface SignUpRequestDto {
    id: string;
    username: string;
    password: string;
    email:string;
    certificationNumber: string;
    gender : string;
    useryear : string;
    birthday : string;
    address? : string;
    subaddress?: string;
}