import axios from 'axios';
import {api} from '../config/api';
const accessToken = localStorage.getItem('token');

const fetchProducts = async () => {
    try {
        const response = await axios.get(`${api.GET_PRODUCTS}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error; // Re-throw the error for further handling
    }
}

export default {
    fetchProducts
}