import axios from 'axios';
import { API_URL, AuthHeader } from '../Config';

export const fetchAddEntertainmentCategories = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/entertainment-categories/add`, {
            name: data.name
        }, {
            headers: AuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error('Add entertainment categories error:', error);
        throw error;
    }
};

export const fetchEntertainmentCategories = async () => {
    try {
        const response = await axios.get(`${API_URL}/entertainment-categories`);
        return response.data;
    } catch (error) {
        console.error('Fetch entertainment categories error:', error);
        throw error;
    }
};

export const fetchUpdateEntertainmentCategories = async (id, name) => {
    try {
        const response = await axios.put(`${API_URL}/entertainment-categories/update/category/${id}`, {
            name
        }, {
            headers: AuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error('Update entertainment categories error:', error);
        throw error;
    }
};

export const fetchDeleteEntertainmentCategories = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/entertainment-categories/delete/category/${id}`, {
            headers: AuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error('Delete entertainment categories error:', error);
        throw error;
    }
};
