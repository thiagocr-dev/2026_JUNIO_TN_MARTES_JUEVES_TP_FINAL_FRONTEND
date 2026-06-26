import { createContext, useEffect, useState } from "react";
import { getProfile } from "../services/authService";

export const AuthContext = createContext({
    isLogged: false,
    userData: null,
    login: () => { },
    logout: () => { }
})

export const AUTH_TOKEN_LOCALSTORAGE_KEY = 'auth_token'

export const AuthContextProvider = ({ children }) => {

    const auth_token = localStorage.getItem(AUTH_TOKEN_LOCALSTORAGE_KEY)

    async function loadUserSesion(token) {
        if (token) {
            try {
                const response = await getProfile(token);
                if (response.ok) {
                    setUserData({
                        email: response.data.user.email,
                        id: response.data.user.id,
                        nombre: response.data.user.nombre
                    });
                }
            } catch (error) {
                console.error("Error cargando sesión:", error);
                logout();
            }
        }
    }

    useEffect(
        () => {
            loadUserSesion(auth_token)
        },
        []
    )

    const [isLogged, setIsLogged] = useState(Boolean(auth_token))

    const [userData, setUserData] = useState(null)

    function login(new_auth_token) {
        localStorage.setItem(AUTH_TOKEN_LOCALSTORAGE_KEY, new_auth_token)
        setIsLogged(true)
        loadUserSesion(new_auth_token)
    }

    function logout() {
        localStorage.removeItem(AUTH_TOKEN_LOCALSTORAGE_KEY)
        setIsLogged(false)
        setUserData(null)
    }

    const providerValues = {
        isLogged,
        userData,
        login,
        logout
    }

    return (
        <AuthContext.Provider value={providerValues}>{children}</AuthContext.Provider>
    )
}