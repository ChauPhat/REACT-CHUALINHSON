import React, { createContext, useContext, useEffect, useState } from 'react';

const ScreenContext = createContext();

export const ScreenProvider = ({ children }) => {
    const [screen, setScreen] = useState(() => {
        const user = JSON.parse(sessionStorage.getItem('user'));
        console.dir(user?.screen_ids?.split(','));
        return user && user?.screen_ids?.split(',');
    });

    useEffect(() => {
        const handleSessionUpdate = () => {
            const user = JSON.parse(sessionStorage.getItem('user'));
            setScreen(user && user?.screen_ids?.split(','));
        };
        window.addEventListener('sessionUpdated', handleSessionUpdate);
        return () => {
            window.removeEventListener('sessionUpdated', handleSessionUpdate);
        };
    }, []);

    return (
        <ScreenContext.Provider value={{ screen, setScreen }}>
            {children}
        </ScreenContext.Provider>
    );
};

export const authorizeScreen = (screen_id, state) => {
    if (!screen_id || !state) return false;
    for (let element of state) {
        if (screen_id.startsWith(element) || element.startsWith(screen_id)) {
            return true;
        }
    }
    return false;
}

export const useScreen = () => useContext(ScreenContext);