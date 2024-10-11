import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export const checkAuth = (token) => {
    try {
        const decodedToken = jwtDecode(token);

        if (decodedToken.adminId) {
            return 'admin';
        } else if (decodedToken.userId) {
            return 'user';
        } else {
            throw new Error('Invalid token');
        }
    } catch (error) {
        console.error('Token decoding failed:', error);
        throw new Error('Token decoding failed');
    }
};

export const ProtectedRoute = ({ children, roleRequired }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const role = checkAuth(token);

            if (roleRequired && role !== roleRequired) {
                navigate('/login');
                return;
            }
        } catch (error) {
            console.error('Token decoding failed', error);
            navigate('/login');
        }
    }, [navigate, roleRequired]);

    return children;
};
