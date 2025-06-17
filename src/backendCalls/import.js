import axios from "axios"
import { api } from "../config/api"

const accessToken = localStorage.getItem('token');

export const fetchImportWarehouses = async () => {
    try {
        const response = await axios.get(`${api.GET_IMPORT}`, {
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
