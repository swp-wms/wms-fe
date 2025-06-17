import axios from "axios"
import { api } from "../config/api"

const accessToken = localStorage.getItem('token');

export const fetchExportWarehouses = async () => {
    try {
        const response = await axios.get(`${api.GET_EXPORT}`, {
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
