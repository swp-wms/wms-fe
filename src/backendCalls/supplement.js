import axios from 'axios';
import {api} from "../config/api";
const accessToken = localStorage.getItem('token');

const getSupplementByOrderId = async (orderId) =>{
    try{
        const response = await axios.get(api.GET_SUPPPLEMENT_ORDER(orderId),
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    }catch(error){
        return error;
    }
}

const addSupplementOrder = async(order) => {
    try{
        const response = await axios.post(api.ADD_SUPPLEMENT_ORDER, order, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch(error) {
        // On failure, this returns the error object, not a custom status or message.
        // If you want a specific structure (e.g., { status: 'failure', ... }), you need to handle it here.
        return error;
    }
}

const getSupplementById = async(id) => {
    try{
        const response = await axios.get(api.GET_SUPPLEMENT_DETAIL_BY_ID(id), {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    }catch(error){
        console.log("error: ",error);
    }
}

export default {
    getSupplementByOrderId,
    addSupplementOrder,
    getSupplementById
};