import axios from 'axios';
import {api} from '../config/api';
const accessToken = localStorage.getItem('token');

const fetchPartners = async () => {
    try{
        const response = await axios.get(`${api.GET_PARTNERS}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
        });
        return response.data;
        //.result.data.data
    }catch(error){
        console.error("Error fetching partners:", error);
        throw error; // Re-throw the error for further handling
    }
}

export default {
    fetchPartners
}