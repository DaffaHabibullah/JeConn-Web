import axios from 'axios';
import { API_URL, AuthHeader } from '../Config';

export const fetchAllUsers = async () => {
    try {
        const response = await axios.get(`${API_URL}/user/all-users`, {
            headers: AuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error('Fetch users error:', error);
        throw error;
    }
};

export const fetchUserProfile = async () => {
    try {
        const response = await axios.get(`${API_URL}/user/profile`, {
            headers: AuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error('Fetch user error:', error);
        throw error;
    }
};

export const fetchUserUpdate = async (fullName, dateOfBirth, gender, address, phoneNumber) => {
    try {
        const response = await axios.post(`${API_URL}/user/update-profile`, {
            fullName,
            dateOfBirth,
            gender,
            address,
            phoneNumber
        }, {
            headers: AuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error('Update user error:', error);
        throw error;
    }
};

export const fetchUserUpdateImage = async (imageProfile) => {
    try {
        const formData = new FormData();
        formData.append('imageProfile', imageProfile);
        const response = await axios.post(`${API_URL}/user/update-image-profile`, formData, {
            headers: {
                ...AuthHeader(),
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Update user image error:', error);
        throw error;
    }
};

export const fetchBanUser = async (id) => {
    try {
        const response = await axios.put(`${API_URL}/user/ban-user/${id}`, {}, {
            headers: AuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error('Ban user error:', error);
        throw error;
    }
};

export const fetchUnbanUser = async (id) => {
    try {
        const response = await axios.put(`${API_URL}/user/unban-user/${id}`, {}, {
            headers: AuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error('Unban user error:', error);
        throw error;
    }
};
