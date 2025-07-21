import axios from 'axios';
import { api } from '../config/api';

const accessToken = localStorage.getItem('token');

/**
 * Fetch data based on the provided parameterz
 * 
 * @param {Object} params
 * @param {string} params.startDate - Start date for the report
 */

const fetchInventoryInOutReport = async (param = {}) => {
    try {
        const queryParams = new URLSearchParams();
        if (param.startDate) queryParams.append('startDate', param.startDate);
        if (param.endDate) queryParams.append('endDate', param.endDate);
        if (param.partnerid) queryParams.append('partnerid', param.partnerid);
        if (param.searchKeyword) queryParams.append('searchKeyword', param.searchKeyword);

        const url = queryParams.toString()
            ? `${api.GET_INVENTORY_REPORT}?${queryParams.toString()}`
            : api.GET_INVENTORY_REPORT;
        console.log("Fetching inventory in-out report from URL:", url);
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        console.log("Inventory Report Data:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching inventory in-out report:", error);
        throw error;
    }
}

export default {
    fetchInventoryInOutReport
}