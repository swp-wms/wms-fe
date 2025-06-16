import axios from "axios"
import { api } from "../config/api"

const accessToken = localStorage.getItem('token');

export const handleLogin = async (username, password) => {
    try {
        const response = await axios.post(api.LOGIN, {
            username, password
        });
        if (response.status === 200) {
            localStorage.setItem('token', response.data.accessToken);
        }
        return response;
    } catch (error) {
        return error;
    }
}

export const handleLogout = async () => {
    try {
        const response = await axios.post(api.LOGOUT);
        localStorage.removeItem('token');

        return response;
    } catch (error) {
        return error;
    }
}

export const getUser = async () => {
    try {
        const response = await axios.get(api.GET_USER, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response;
    } catch (error) {
        return error;
    }
}
