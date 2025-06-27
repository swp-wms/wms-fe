import axios from 'axios';
import { api } from '../config/api';
const accessToken = localStorage.getItem('token');

export const getRemainQuantityOfOrder = async (orderid) => {
    try {
        const response = await axios.get(api.GET_REMAIN_QUANTITY(orderid), {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response;
    } catch (error) {
        return error;
    }
}

export const checkCompleteOrder = async (orderid) => {
    try {
        const response = await axios.put(api.CHECK_COMPLETE(orderid), {}, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response;
    } catch (error) {
        return error;
    }
}