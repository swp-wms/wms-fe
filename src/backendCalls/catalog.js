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

const addCatalog = async (catalog) => {
    try{
        const response = await axios.post(`${api.ADD_CATALOG}`, catalog, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    }catch(error) {
        console.error("Error adding catalog:", error);
        throw error;
    }
}

const fetchCatalogBrands = async () => {
    try {
        const response = await axios.get(`${api.GET_CATALOG_BRANDS}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response;    
    }
    catch( error ){
        console.error("Error fetching catalog brands:", error);
        throw error;
    }
}

const fetchCatalogPrimaryKeys = async() =>{
    try {
        const response = await axios.get(`${api.GET_CATALOG_PRIMARY_KEY}`,{
            headers:{
                Authorization : `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response;
    }catch(error){
        console.error("Error fetching:", error);
        throw error;
    }
}
const updateCatalog = async (catalog) => {
    try{
        const result = await axios.put(`${api.ADD_CATALOG}`,catalog,{
            headers:{
                Authorization : `Bearer ${localStorage.getItem('token')}`
            }
        })
        if(result.error){
            console.log("Error:", result.error);
            return result;
        }
        
        return result;
    }catch(error){
        console.log("Exception:", error);
        throw error;

    }
}
export default {
    fetchCatalog,
    addCatalog,
    fetchCatalogBrands,
    fetchCatalogPrimaryKeys,
    updateCatalog
}