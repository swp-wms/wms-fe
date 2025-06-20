import axios from 'axios';
import {api} from '../config/api';
const accessToken = localStorage.getItem('token');

const getUserInfo = async () => {
    try {
        const response = await axios.get(api.GET_USER, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        console.log(response);

        return response;
    } catch (error) {
        return error;
    }
}

export const updateUserInfo = async (newUserData) => {
    try {
        // tạo 1 cái api mới ở file api ý. như kiểu ở đây thì update user cần 1 api mới. api này là cái nối đến backend, là cột api trong bảng backend trên sheet ý.
        // vừa nãy m để api.USER, cái này đã tạo bên file api đâu.
        // t vừa tạo 1 api mới. qua bên file api đọc kĩ nhé.
        // môi lần cần fetch data từ backend, thì phải tạo 1 api mới.

        const response = await axios.put(api.UPDATE_USER(newUserData.id), newUserData, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        console.log(response);

        return response;
    } catch (error) {
        return error;
    }
}

export const getAllUserInfo = async () => {
    try {
        const response = await axios.get(api.GET_ALL_USER, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        console.log(response);

        return response;
    } catch (error) {
        return error;
    }
}

export const createNewUser = async (newUserData) => {
    try {
        const response = await axios.post(api.CREATE_USER, newUserData, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        console.log(response);

        return response;
    } catch (error) {
        return error;
    }
}

export default getUserInfo;
