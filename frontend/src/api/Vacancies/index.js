import axios from 'axios';
import { API_URL, AuthHeader } from '../Config';

export const fetchPostVacancies = async (
    typePost, title, location, startDate, endDate, address, description, candidates, salary, typeSalary, entertainment_id
) => {
    try {
        const response = await axios.post(`${API_URL}/vacancies/post`, {
            typePost,
            title,
            location,
            startDate,
            endDate,
            address,
            description,
            candidates,
            salary,
            typeSalary,
            entertainment_id
        }, {
            headers: AuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error('Fetch user error:', error);
        throw error;
    }
};

export const fetchAllPostVacancies = async () => {
    try {
        const response = await axios.get(`${API_URL}/vacancies/getAll/post`);
        return response.data;
    } catch (error) {
        console.error('Fetch user error:', error);
        throw error;
    }
};

export const fetchPostVacanciesById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/vacancies/get/post/${id}`);
        return response.data;
    } catch (error) {
        console.error('Fetch user error:', error);
        throw error;
    }
};

export const fetchUpdateVacancies = async (
    id, title, startDate, endDate, address, description, candidates, salary, typeSalary, entertainment_id
) => {
    try {
        const response = await axios.put(`${API_URL}/vacancies/update/post/${id}`, {
            title,
            startDate,
            endDate,
            address,
            description,
            candidates,
            salary,
            typeSalary,
            entertainment_id
        }, {
            headers: AuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error('Fetch user error:', error);
        throw error;
    }
};

export const fetchDeleteVacancies = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/vacancies/delete/post/${id}`, {
            headers: AuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error('Fetch user error:', error);
        throw error;
    }
};

export const fetchSubmitVacancies = async (id) => {
    try {
        const response = await axios.post(`${API_URL}/vacancies/submit-candidate/post/${id}`, {}, {
            headers: AuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error('Fetch user error:', error);
        throw error;
    }
};
