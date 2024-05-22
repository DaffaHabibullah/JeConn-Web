import axios from 'axios';
import { API_URL, AuthHeader } from '../Config';

export const fetchTalentRegister = async (nikKTP, firstName, lastName, phoneNumber, address, provinceId, postalCode) => {
    try {
        const response = await axios.post(`${API_URL}/talent/register`, {
            nikKTP,
            firstName,
            lastName,
            phoneNumber,
            address,
            provinceId,
            postalCode
        }, {
            headers: AuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error('Register talent error:', error);
        throw error;
    }
};

export const fetchTalentProfile = async () => {
    try {
        const response = await axios.get(`${API_URL}/talent/profile`, {
            headers: AuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error('Fetch talent error:', error);
        throw error;
    }
};

export const fetchTalentUpdate = async (biography, location, entertainment_id, isOpen) => {
    try {
        const response = await axios.put(`${API_URL}/talent/update-profile`, {
            biography,
            location,
            entertainment_id,
            isOpen
        }, {
            headers: AuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error('Update talent error:', error);
        throw error;
    }
};

export const fetchTalentUploadImage = async (imageTalent) => {
    try {
        const formData = new FormData();
        formData.append('imageTalent', imageTalent);
        const response = await axios.post(`${API_URL}/talent/upload-image-profile`, formData, {
            headers: {
                ...AuthHeader(),
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Update talent image error:', error);
        throw error;
    }
};

export const fetchTalentAllImages = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/talent/${id}/images`);
        return response.data;
    } catch (error) {
        console.error('Fetch talent images error:', error);
        throw error;
    }
};
