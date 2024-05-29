export default interface SnsUserRequestDto {
    userId: string;
    newId : string;
    username: string;
    password: string;
    email: string;
    gender : string;
    useryear : string;
    birthday : string;
    address? : string;
    subaddress?: string;
}