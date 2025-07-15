import axios from "axios"
import { api } from "../config/api"

const accessToken = localStorage.getItem('token');

export const getAllImportDelivery = async () => {
    try {
        const response = await axios.get(api.GET_IMPORT_DELIVERY, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response;
    } catch (error) {
        return error;
    }
}
export const getAllExportDelivery = async () => {
    try {
        const response = await axios.get(api.GET_EXPORT_DELIVERY, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response;
    } catch (error) {
        return error;
    }
}
export const getDeliveriesForOrder = async (orderid) => {
    try {
        const response = await axios.get(api.GET_DELIVERY_FOR_ORDER(orderid), {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response;
    } catch (error) {
        return error;
    }
}

export const getDeliveryDetail = async (deliveryid) => {
    try {
        const response = await axios.get(api.GET_DELIVERY_DETAIL(deliveryid), {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response;
    } catch (error) {
        return error;
    }
}

export const handleCreateDelivery = async (orderid, newDelivery) => {
    try {
        const response = await axios.post(api.CREATE_DELIVERY_FOR_ORDER(orderid), {
            newDelivery: newDelivery
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response;
    } catch (error) {
        return error;
    }
}

export const handleAddTruck = async (deliveryid, driver) => {
    try {
        const response = await axios.put(api.ADD_TRUCK_FOR_DELIVERY(deliveryid), {
            driver
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response;
    } catch (error) {
        return error;
    }
}
export const handleApproveTruck = async (deliveryid, deliverystatus) => {
    try {
        const response = await axios.put(api.APPROVE_TRUCK(deliveryid), {
            deliverystatus
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response;
    } catch (error) {
        return error;
    }
}
export const handleConfirmNotEnoughTruck = async (deliveryid) => {
    try {
        const response = await axios.put(api.NOT_ENOUGH_TRUCK(deliveryid), {}, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response;
    } catch (error) {
        return error;
    }
}
export const handleIsDeliverying = async (deliveryid, act) => {
    try {
        console.log(hi);

        const response = await axios.put(api.IS_DELIVERYING(deliveryid), {}, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        console.log(response);

        return response;
    } catch (error) {
        return error;
    }
}
export const handleUpdateRealData = async (deliveryid, realData, act) => {
    try {
        const response = await axios.put(api.UPDATE_REAL_DELIVERY_DATA(deliveryid), { realData, act }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response;
    } catch (error) {
        return error;
    }
}
export const handleCancelDelivery = async (deliveryid) => {
    try {
        const response = await axios.put(api.CANCEL_DELIVERY(deliveryid), {}, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response;
    } catch (error) {
        return error;
    }
}