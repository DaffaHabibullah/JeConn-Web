import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchRegister = async (username, email, password) => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, {
            username,
            email,
            password
        });
        return response.data;
    } catch (error) {
        console.error('Register error:', error);
        throw error;
    }
};

export const fetchLogin = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, {
            email,
            password
        });
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};
