import axios from 'axios';
import { API_URL, AuthHeader } from '../Config';

export const fetchAddLocations = async (name) => {
    try {
        const response = await axios.post(`${API_URL}/location/add`, {
            name: name
        }, {
            headers: AuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error('Add indonesia provinces error:', error);
        throw error;
    }
};

export const fetchLocations = async () => {
    try {
        const response = await axios.get(`${API_URL}/location`);
        return response.data;
    } catch (error) {
        console.error('Fetch indonesia provinces error:', error);
        throw error;
    }
};

export const fetchUpdateLocations = async (id, name) => {
    try {
        const response = await axios.put(`${API_URL}/location/update/province/${id}`, {
            name
        }, {
            headers: AuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error('Update indonesia provinces error:', error);
        throw error;
    }
};

export const fetchDeleteLocations = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/location/delete/province/${id}`, {
            headers: AuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error('Delete indonesia provinces error:', error);
        throw error;
    }
};
