import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const response = await axios.get('/api/auth/status');
            setUser(response.data.user);
        } catch (error) {
            console.error('Auth status check failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await axios.post('/api/auth/login', { email, password });
            setUser(response.data.user);
            return response.data.user;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const response = await axios.post('/api/auth/register', userData);
            setUser(response.data.user);
            return response.data.user;
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await axios.post('/api/auth/logout');
            setUser(null);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
