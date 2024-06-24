import axios from 'axios';
import { API_URL, AuthHeader } from '../Config';

export const fetchCreateMessageRoom = async (username) => {
    try {
        const response = await axios.post(`${API_URL}/message/create-room`, {
            members: username
        }, {
            headers: AuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error('Create message room error:', error);
        throw error;
    }
};

export const fetchAllMessagesByRoomId = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/message/room/${id}`, {
            headers: AuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error('Fetch messages error:', error);
        throw error;
    }
};

export const fetchSendMessage = async (id, message) => {
    try {
        const response = await axios.post(`${API_URL}/message/room/${id}/send-message`, {
            message
        }, {
            headers: AuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error('Send message error:', error);
        throw error;
    }
};

export const fetchSendImageMessage = async (id, formData) => {
    try {
        const response = await axios.post(`${API_URL}/message/room/${id}/send-image`, formData, {
            headers: {
                ...AuthHeader(),
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Send image message error:', error);
        throw error;
    }
};
