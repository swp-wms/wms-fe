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

const addProduct = async(productInfo) => {
    try{
        const response = await axios.post(`${api.ADD_PRODUCT}`,productInfo,{
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('Product added:', response.data);
        return response;

    }catch(error){
        console.error("Error adding product:", error);
        throw error; // Re-throw the error for further handling
    }
}
export default {
    fetchProducts,
    addProduct
}