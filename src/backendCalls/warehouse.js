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

export const fetchWarehousesByDate = async (delivery_date) => {
    try {
        const response = await axios.get(`${api.GET_WAREHOUSE_BY_DATE(delivery_date)}`, {
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

export const fetchWeightByBrand = async () => {
    try {
        const response = await axios.get(`${api.GET_WEIGHT_BY_BRANDNAME}`, {
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

export const fetchWeightByType = async () => {
    try {
        const response = await axios.get(`${api.GET_WEIGHT_BY_TYPE}`, {
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

export const fetchWeightByPartner = async () => {
    try {
        const response = await axios.get(`${api.GET_WEIGHT_BY_PARTNER}`, {
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

