import React, { createContext, useContext, useState, useEffect } from 'react';
import CustomerSessionManager from '../utils/CustomerSessionManager';

const AuthContext = createContext(null);
const sessionManager = new CustomerSessionManager();

export const AuthProvider = ({ children }) => {
    const [currentCustomer, setCurrentCustomer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing session on mount
        const customer = sessionManager.getCurrentCustomer();
        setCurrentCustomer(customer);
        setLoading(false);
    }, []);

    const login = (email, password) => {
        const success = sessionManager.loginCustomer(email, password);
        if (success) {
            setCurrentCustomer(sessionManager.getCurrentCustomer());
        }
        return success;
    };

    const register = (customerData) => {
        const customerId = sessionManager.registerCustomer(customerData);
        setCurrentCustomer(sessionManager.getCurrentCustomer());
        return customerId;
    };

    const logout = () => {
        sessionManager.clearCurrentCustomer();
        setCurrentCustomer(null);
    };

    const value = {
        currentCustomer,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!currentCustomer
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 