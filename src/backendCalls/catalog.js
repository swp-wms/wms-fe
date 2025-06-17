import axios from 'axios';
import {api} from '../config/api';
const accessToken = localStorage.getItem('token');

const fetchCatalog = async () => {
    try {
        const response = await axios.get(`${api.GET_CATALOGS}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching catalog:", error);
        throw error;
    }
}

export default {
    fetchCatalog
}