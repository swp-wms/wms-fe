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

const addPartner = async (partnerInfo) => {
    try{
        const response = await axios.post(`${api.ADD_PARTNER}`, partnerInfo, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        return response;
    }catch(error){
        console.error("Error adding partner:", error);
        throw error; // Re-throw the error for further handling
    }
}

export default {
    fetchPartners,
    addPartner  
}