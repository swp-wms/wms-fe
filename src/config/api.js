const baseUrl = 'http://localhost:3800';

export const api = {
    LOGIN: `${baseUrl}/login`,
    LOGOUT: `${baseUrl}/logout`,
    REGISTER: `${baseUrl}/register`,
    GET_USER: `${baseUrl}/users/me`,
    FORGET_PASSWORD: `${baseUrl}/forget-password`,
    RESET_PASSWORD: `${baseUrl}/reset-password`,
    // Order API
    GET_ORDERS: `${baseUrl}/orders`,
    GET_IMPORT_ORDER: `${baseUrl}/orders/import`,
    GET_EXPORT_ORDER: `${baseUrl}/orders/export`,
    GET_ORDER_DETAIL: `${baseUrl}/detail`,
    CREATE_ORDER: `${baseUrl}/orders/`,

    //partner API
    GET_PARTNERS: `${baseUrl}/partners`,
    ADD_PARTNER: `${baseUrl}/partners/`,

    //product API
    GET_PRODUCTS: `${baseUrl}/products`,
    ADD_PRODUCT: `${baseUrl}/products`,

    GET_OTP: `${baseUrl}/reset-password/get-otp`,
    VERIFY_OTP: `${baseUrl}/reset-password/verify-otp`,

    //catalog API
    GET_CATALOGS: `${baseUrl}/catalog`,
}