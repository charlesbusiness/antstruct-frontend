import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth as authService } from "../services/authentication/authService";

const AuthContext = createContext({
    auth: null,
    setAuth: () => { },
    user: null,
});

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null);
    const [user, setUser] = useState(null);
      const [signupData, setSignupData] = useState({});


    useEffect(() => {
        const isAuth = async () => {
            try {
                setUser(authService.getCurrentUser())
            } catch (error) {
                setUser(null)
            };
        };

        isAuth();
    }, [auth]);

    return (
        <AuthContext.Provider value={{ auth, setAuth, user , signupData, setSignupData}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;