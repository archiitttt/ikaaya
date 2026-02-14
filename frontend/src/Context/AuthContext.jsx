import { createContext, useContext, useEffect, useState } from "react";
import api from '../api/axios.js';

const AuthContext = createContext(null);

export const AuthProvider = ({children})=>{
    const [user, setUser] = useState(null);
    const [loadBuffer, setLoadBuffer] = useState(true);

    const checkAuth = async ()=>{
        try{
            const res = await api.get('auth/me');
            setUser(res.data.user);
        }
        catch{
            setUser(null);
        }
        finally{
            setLoadBuffer(false);
        }
    };

    const isAuthenticated = !!user;

    useEffect(()=>{
        checkAuth();
    }, [])

    return (
        <AuthContext.Provider value={{user, isAuthenticated, loadBuffer, setUser, checkAuth}}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = ()=> useContext(AuthContext);