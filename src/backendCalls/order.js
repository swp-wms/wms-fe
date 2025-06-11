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

const getOrderDetail = async(id) =>{
    try{
        const response  = await axios.get('./orders/${id}');
        return response.data;
    }catch(error){
        return error;
    }
}

export default {
    getImportOrder,
    getOrderDetail
}