import axios from 'axios';
import { API_URL } from '../Config';

export const fetchLocations = async () => {
    try {
        const response = await axios.get(`${API_URL}/location`);
        return response.data;
    } catch (error) {
        console.error('Fetch indonesia provinces error:', error);
        throw error;
    }
};
