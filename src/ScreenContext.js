import React, { createContext, useContext, useEffect, useState } from 'react';
import apiClient from './apiClient';

const ScreenContext = createContext();

export const ScreenProvider = ({ children }) => {
    const [screen, setScreen] = useState(() => {
        const user = JSON.parse(sessionStorage.getItem('user'));
        return user && user?.screen_ids?.split(',');
        // const result = user && user?.screen_ids?.split(',');
        // if (result) {
        //     await fetchScreens();
        // }
        // return result;
    });


    const [screens, setScreens] = useState([]);

    const fetchScreens = async () => {
        try {
            const response = await apiClient.get('/api/screens/get-all');
            setScreens(response.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {
        { JSON.parse(sessionStorage.getItem('user')) && fetchScreens() }
        // fetchScreens();
        const handleSessionUpdate = () => {
            const user = JSON.parse(sessionStorage.getItem('user'));
            const result = user && user?.screen_ids?.split(',');
            setScreen(result);
            // console.dir(result);
            if (result && (!screens || screens.length === 0)) {
                fetchScreens();
            }
        };
        window.addEventListener('sessionUpdated', handleSessionUpdate);
        return () => {
            window.removeEventListener('sessionUpdated', handleSessionUpdate);
        };
    }, []);

    return (
        <ScreenContext.Provider value={{ screen, setScreen, screens, setScreens }}>
            {children}
        </ScreenContext.Provider>
    );
};

export const authorizeScreen = (screen_id, state) => {
    if (!screen_id || !state) return false;
    for (let element of state) {
        if (element === '*' || screen_id.startsWith(element) || element.startsWith(screen_id)) {
            return true;
        }
    }
    return false;
}

export const authorizeRole = (require, state) => {
    if (!require) return true;
    if (!state) return false;
    const setRequire = new Set(require);
    return state.some(element => setRequire.has(element));
}

export const useScreen = () => useContext(ScreenContext);

export const useScreens = () => useContext(ScreenContext);