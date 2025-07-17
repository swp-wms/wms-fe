import axios from 'axios';
import {api} from '../config/api';
const accessToken = localStorage.getItem('token');

const getUserInfo = async () => {
    try {
        const response = await axios.get(api.GET_USER, {
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

export const updateUserInfo = async (newUserData) => {
    try {
        const response = await axios.put(api.UPDATE_USER(newUserData.id), newUserData, {
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

export const getAllUserInfo = async () => {
    try {
        const response = await axios.get(api.GET_ALL_USER, {
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

export const createNewUser = async (newUserData) => {
    try {
        const response = await axios.post(api.REGISTER, newUserData, {
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

export default getUserInfo;
