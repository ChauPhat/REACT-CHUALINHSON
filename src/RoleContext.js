import { jwtDecode } from 'jwt-decode';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { replaceRole, Role } from './GlobalVariable';

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
    const [role, setRole] = useState(() => {
        const token = sessionStorage.getItem('token');
        const decodedToken = token && jwtDecode(token);
        return decodedToken && replaceRole(Role, decodedToken?.roles?.split(','));
    });

    useEffect(() => {
        const handleTokenChange = () => {
            const token = sessionStorage.getItem('token');
            const decodedToken = token ? jwtDecode(token) : null;
            setRole(decodedToken && replaceRole(Role, decodedToken?.roles?.split(',')));
        };

        window.addEventListener('storage', handleTokenChange);
        return () => window.removeEventListener('storage', handleTokenChange); 
    }, []);

    return (
        <RoleContext.Provider value={{ role, setRole }}>
            {children}
        </RoleContext.Provider>
    );
};

export const useRole = () => useContext(RoleContext);
