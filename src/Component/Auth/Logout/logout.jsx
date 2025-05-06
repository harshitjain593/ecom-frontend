import  { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutUser = () => {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem('token');
        navigate('/login');
    }, [navigate]);

    return null;
};

export default LogoutUser;
