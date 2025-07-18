import axios from "axios"
import { api } from "../config/api"

const accessToken = localStorage.getItem('token');

export const fetchProductCatalog = async () => {
    try {
        const response = await axios.get(`${api.GET_PRODUCT_CATALOG}`, {
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

export const addProduct = async(productInfo) => {
    try{
        const response = await axios.post(`${api.ADD_PRODUCT_CATALOG}`,productInfo,{
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('Product added:', response.data);
        return response;

    }catch(error){
        console.error("Error adding product:", error);
        throw error; 
    }
}

export const updateProductCatalog = async (id,data) => {
    try{
    const response = await axios.put(`${api.UPDATE_PRODUCT_CATALOG(id)}`,data,{
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    console.log("Sended to backend successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
}


