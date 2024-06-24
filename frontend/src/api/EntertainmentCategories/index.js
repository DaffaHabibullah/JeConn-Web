import axios from 'axios';
import { API_URL } from '../Config';

export const fetchEntertainmentCategories = async () => {
    try {
        const response = await axios.get(`${API_URL}/entertainment-categories`);
        return response.data;
    } catch (error) {
        console.error('Fetch entertainment categories error:', error);
        throw error;
    }
};
