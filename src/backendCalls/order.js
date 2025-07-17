import axios from 'axios';
import {api} from '../config/api';
const accessToken = localStorage.getItem('token');

const getImportOrder = async () => {
    try{

     const response = await axios.get(`${api.GET_IMPORT_ORDER}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    return response.data;
    }catch(error){
        return error;
    }
}
const getExportOrder = async () => {
    try{

     const response = await axios.get(`${api.GET_EXPORT_ORDER}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    return response.data;
    }catch(error){
        return error;
    }
}



const getOrderDetail = async(id) =>{
    try{
        const response  = await axios.get(`${api.GET_ORDER_DETAIL}/${id}`,{
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    }catch(error){
        return error;
    }
}

const createImportOrder = async (orderData) => {
    try {
        const response = await axios.post(`${api.CREATE_ORDER}`, orderData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        console.log("Order created successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error creating import order:", error);
        throw error;
    }
}

const fetchDeliveryDetails = async (id) => {
    try {
        const response = await axios.get(`${api.GET_DELIVERY_DETAIL_FOR_UPDATE_ORDER}/${id}`,{
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching delivery details:", error);
        throw error;
    }
}

const updateOrder = async (id,data) =>{
    try{
    const response = await axios.put(`${api.UPDATE_ORDER(id)}`,data,{
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    });
    console.log("Sended to backend successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
}

const getProductGeneral = async() => {
    try{
        const response = await axios.get(`${api.GET_PRODUCT_GENERAL}`,{
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }

        });
        console.log("Product General Data:", response.data);
        return response.data;
    }catch(error){
        console.error("Exception fetching product general data:", error);
        throw error;
    }
}

export default {
    getImportOrder,
    getExportOrder,
    getOrderDetail,
    createImportOrder,
    fetchDeliveryDetails,
    updateOrder,
    getProductGeneral
}