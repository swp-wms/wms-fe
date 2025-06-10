const baseUrl = 'http://localhost:3800';

export const api = {
    LOGIN: `${baseUrl}/login`,
    LOGOUT: `${baseUrl}/logout`,
    REGISTER: `${baseUrl}/register`,
    GET_USER: `${baseUrl}/users/me`,
    FORGET_PASSWORD: `${baseUrl}/forget-password`,
    RESET_PASSWORD: `${baseUrl}/reset-password`,
    GET_OTP: `${baseUrl}/reset-password/get-otp`,
    VERIFY_OTP: `${baseUrl}/reset-password/verify-otp`,
}