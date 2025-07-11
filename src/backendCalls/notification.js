import axios from 'axios';
import { api } from '../config/api';
const accessToken = localStorage.getItem('token');

export const getAllNotifcations = async () => {
    try {
        const response = await axios.get(api.GET_NOTIFS, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        return response;
    } catch (error) {
        console.log(error);
    }
}
