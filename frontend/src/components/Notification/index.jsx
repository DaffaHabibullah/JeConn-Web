import { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';

const NotificationContext = createContext();

export const useNotification = () => {
    return useContext(NotificationContext);
};

const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        if (notification) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsExiting(true);
            }, 4500);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const showNotification = (message, success) => {
        const variant = success === false ? 'danger' : 'success';
        setNotification({ message, variant });
        setIsExiting(false);
        setTimeout(() => {
            setNotification(null);
            setIsVisible(false);
            setIsExiting(false);
        }, 5000);
    };

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            {notification && (
                <div style={{
                    position: 'fixed',
                    top: isExiting ? '-100px' : '16px',
                    right: isVisible ? '8px' : '-300px',
                    zIndex: 9999,
                    transition: 'right 0.5s ease-out, top 0.5s ease-in',
                    borderRadius: '8px',
                    fontSize: '14px',
                    opacity: isVisible ? 1 : 0
                }}>
                    <Alert className="m-0" variant={notification.variant} onClose={() => setIsVisible(false)} dismissible>
                        {notification.message}
                    </Alert>
                </div>
            )}
        </NotificationContext.Provider>
    );
};


export default NotificationProvider;
