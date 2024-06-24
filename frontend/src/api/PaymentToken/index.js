import axios from 'axios';
import { API_URL, AuthHeader } from '../Config';

export const fetchPaymentToken = async () => {
    try {
        const response = await axios.get(`${API_URL}/payment/token`, {
            headers: AuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error('Fetch payment token error:', error);
        throw error;
    }
};
