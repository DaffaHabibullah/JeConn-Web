export const API_URL = import.meta.env.VITE_API_URL;

export const AuthHeader = () => {
    const token = localStorage.getItem('token');
    if (token) {
        return { Authorization: `Bearer ${token}` };
    }
    return {};
};
