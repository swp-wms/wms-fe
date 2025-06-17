const baseUrl = "http://localhost:3800";

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

  //partner API
  GET_PARTNERS: `${baseUrl}/partners`,

  //product API
  GET_PRODUCTS: `${baseUrl}/products`,

  //warehouse API
  GET_WAREHOUSE: `${baseUrl}/warehouse`,

  //import API
  GET_IMPORT: `${baseUrl}/warehouse/import`,

  //export API
  GET_EXPORT: `${baseUrl}/warehouse/export`,

  GET_OTP: `${baseUrl}/reset-password/get-otp`,
  VERIFY_OTP: `${baseUrl}/reset-password/verify-otp`,
};
