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
export const getSeenNotifcations = async (index) => {
    try {
        const response = await axios.get(api.GET_SEEN_NOTIF(index), {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        return response;
    } catch (error) {
        console.log(error);
    }
}

export const handleSeenNotifcation = async (id) => {
    try {
        const response = await axios.post(api.SEEN_NOTIF(id), {}, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        return response;
    } catch (error) {
        console.log(error);
    }
}

