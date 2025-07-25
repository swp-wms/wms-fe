const baseUrl = "http://localhost:3800";

export const api = {
  LOGIN: `${baseUrl}/login`,
  LOGOUT: `${baseUrl}/logout`,
  REGISTER: `${baseUrl}/register`,
  GET_USER: `${baseUrl}/users/me`,
  GET_ALL_USER_INFO: `${baseUrl}/users/info`,
  UPDATE_USER: (userid) => `${baseUrl}/users/${userid}`,
  FORGET_PASSWORD: `${baseUrl}/forget-password`,
  RESET_PASSWORD: `${baseUrl}/reset-password`,

  // Order API
  GET_ORDERS: `${baseUrl}/orders`,
  GET_IMPORT_ORDER: `${baseUrl}/orders/import`,
  GET_EXPORT_ORDER: `${baseUrl}/orders/export`,
  GET_IMPORT_WEIGHT: `${baseUrl}/orders/importweight`,
  GET_EXPORT_WEIGHT: `${baseUrl}/orders/exportweight`,
  GET_ORDER_DETAIL: `${baseUrl}/detail`,
  CREATE_ORDER: `${baseUrl}/orders/`,
  GET_DELIVERY_DETAIL_FOR_UPDATE_ORDER: `${baseUrl}/orders/delivery`,
  UPDATE_ORDER: (orderid) => `${baseUrl}/orders/${orderid}`,

  GET_REMAIN_QUANTITY: (orderid) => `${baseUrl}/detail/${orderid}/remain`,
  CHECK_COMPLETE: (orderid) => `${baseUrl}/orders/${orderid}/complete`,

  GET_SUPPPLEMENT_ORDER: (orderid) => `${baseUrl}/supplement/${orderid}`,
  ADD_SUPPLEMENT_ORDER: `${baseUrl}/supplement`,
  GET_SUPPLEMENT_DETAIL_BY_ID: (id) => `${baseUrl}/supplement/detail/${id}`,

  //admin API
  GET_ALL_USER: `${baseUrl}/users`,
  REGISTER_ADMIN: `${baseUrl}/admin/register`,


  //partner API
  GET_PARTNERS: `${baseUrl}/partners`,
  ADD_PARTNER: `${baseUrl}/partners/`,
  UPDATE_PARTNER: (partnerid) => `${baseUrl}/partners/${partnerid}`,

  //product API
  GET_PRODUCTS: `${baseUrl}/products`,
  ADD_PRODUCT: `${baseUrl}/products`,

  GET_PRODUCT_GENERAL :`${baseUrl}/orders/product_general`,

  UPDATE_PRODUCT: (productid) => `${baseUrl}/products/${productid}`,

  //product catalog API
  GET_PRODUCT_CATALOG: `${baseUrl}/product-catalog`,
  ADD_PRODUCT_CATALOG: `${baseUrl}/product-catalog`,
  UPDATE_PRODUCT_CATALOG: (productid) => `${baseUrl}/product-catalog/${productid}`,
  VIEW_PRODUCT_HISTORY: (productid) => `${baseUrl}/product-catalog/${productid}`,



  //warehouse API
  GET_WAREHOUSE: `${baseUrl}/warehouse`,
  GET_WAREHOUSE_BY_DATE: (createdate) => `${baseUrl}/warehouse/future/${createdate}`,
  GET_WEIGHT_BY_BRANDNAME: `${baseUrl}/warehouse/brandname`,
  GET_WEIGHT_BY_TYPE: `${baseUrl}/warehouse/type`,
  GET_WEIGHT_BY_PARTNER: `${baseUrl}/warehouse/partner`,

  //import API
  GET_IMPORT: `${baseUrl}/warehouse/import`,

  //export API
  GET_EXPORT: `${baseUrl}/warehouse/export`,

  //otp api
  GET_OTP: `${baseUrl}/reset-password/get-otp`,
  VERIFY_OTP: `${baseUrl}/reset-password/verify-otp`,

  //catalog API
  GET_CATALOGS: `${baseUrl}/catalog`,
  ADD_CATALOG: `${baseUrl}/catalog`,
  GET_CATALOG_BRANDS: `${baseUrl}/catalog/brands`,
  GET_CATALOG_PRIMARY_KEY: `${baseUrl}/catalog/keys`,

  // DELIVERY API
  GET_IMPORT_DELIVERY: `${baseUrl}/delivery/import`,
  GET_EXPORT_DELIVERY: `${baseUrl}/delivery/export`,
  GET_ALL_DELIVERY: `${baseUrl}/delivery`,
  GET_DELIVERY_FOR_ORDER: (orderid) => `${baseUrl}/delivery/order/${orderid}`,
  GET_DELIVERY_DETAIL: (deliveryid) => `${baseUrl}/delivery/${deliveryid}`,
  CREATE_DELIVERY_FOR_ORDER: (orderid) => `${baseUrl}/delivery/order/${orderid}`,
  ADD_TRUCK_FOR_DELIVERY: (deliveryid) => `${baseUrl}/delivery/${deliveryid}`,
  APPROVE_TRUCK: (deliveryid) => `${baseUrl}/delivery/${deliveryid}/approve`,
  IS_DELIVERYING: (deliveryid) => `${baseUrl}/delivery/${deliveryid}/is-deliverying`,
  COMPLETE: (deliveryid) => `${baseUrl}/delivery/${deliveryid}/complete`,
  CANCEL_DELIVERY: (deliveryid) => `${baseUrl}/delivery/${deliveryid}/cancel`,
  NOT_ENOUGH_TRUCK: (deliveryid) => `${baseUrl}/delivery/${deliveryid}/not-enough-truck`,
  UPDATE_REAL_DELIVERY_DATA: (deliveryid) => `${baseUrl}/delivery/${deliveryid}/real`,

  //notification API
  GET_NOTIFS: `${baseUrl}/notification`,
  GET_SEEN_NOTIF: (index) => `${baseUrl}/notification/seen/${index}`,
  SEEN_NOTIF: (notifId) => `${baseUrl}/notification/${notifId}`,

  //report
  GET_INVENTORY_REPORT: `${baseUrl}/report`,
}

  