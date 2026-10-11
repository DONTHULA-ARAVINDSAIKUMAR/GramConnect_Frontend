import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const rawUser = localStorage.getItem('gramconnectUser') || localStorage.getItem('user');
            const storedToken = localStorage.getItem('token') || 'gc-session-active';
            if (rawUser) {
                const parsedUser = JSON.parse(rawUser);
                setUser(parsedUser);
                setToken(storedToken);
            }
        } catch {
            localStorage.removeItem('gramconnectUser');
            localStorage.removeItem('user');
        } finally {
            setLoading(false);
        }
    }, []);

    const login = (userData, jwtToken = 'gc-session-active') => {
        const cleanUser = { ...userData };
        delete cleanUser.password;
        setUser(cleanUser);
        setToken(jwtToken);
        localStorage.setItem('gramconnectUser', JSON.stringify(cleanUser));
        localStorage.setItem('user', JSON.stringify(cleanUser));
        localStorage.setItem('token', jwtToken);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('gramconnectUser');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    const isAuthenticated = Boolean(user);
    const isAdmin = user?.role === 'ADMIN';

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout, isAuthenticated, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};
