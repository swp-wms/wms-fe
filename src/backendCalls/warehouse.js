import axios from "axios"
import { api } from "../config/api"

const accessToken = localStorage.getItem('token');

export const fetchWarehouses = async () => {
    try {
        const response = await axios.get(`${api.GET_WAREHOUSE}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        console.log(response);
        return response.data;
    } catch (error) {
        console.error("Error fetching warehouses:", error);
        throw error; 
    }
}
