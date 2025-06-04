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