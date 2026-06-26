import ENVIRONMENT from "../config/environment"

export async function login(email, password) {
    try {
        console.log("URL_API:", ENVIRONMENT.URL_API)
        const response_http = await fetch(
            ENVIRONMENT.URL_API + '/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-type': "application/json"
            },
            body: JSON.stringify(
                {
                    email: email,
                    password: password
                }
            )
        }
        )
        const response = await response_http.json()
        if (!response.ok) {
            throw new Error(response.message)
        }
        return response
    }
    catch (error) {
        throw new Error("Error al hacer login")
    }
}

export async function register(email, password, username) {
    try {
        console.log("URL_API:", ENVIRONMENT.URL_API)
        const response_http = await fetch(
            ENVIRONMENT.URL_API + '/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-type': "application/json"
            },
            body: JSON.stringify(
                {
                    email: email,
                    password: password,
                    username: username
                }
            )
        }
        )
        const response = await response_http.json()
        return response
    }
    catch (error) {
        throw new Error("Error al hacer el registro")
    }
}

export async function getProfile(token) {
    try {
        const response_http = await fetch(
            ENVIRONMENT.URL_API + '/api/auth/profile', {
            method: 'GET',
            headers: {
                'Content-type': "application/json",
                'Authorization': `Bearer ${token}`
            }
        });
        const response = await response_http.json()
        if (!response.ok) {
            throw new Error(response.message)
        }
        return response
    } catch (error) {
        throw new Error("Error al obtener el perfil")
    }
}