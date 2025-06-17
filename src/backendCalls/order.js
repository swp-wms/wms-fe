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
        return response.data;
    } catch (error) {
        console.error("Error creating import order:", error);
        throw error;
    }
}

export default {
    getImportOrder,
    getExportOrder,
    getOrderDetail,
    createImportOrder
}