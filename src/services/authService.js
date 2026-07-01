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
        throw new Error(error.message || "Error al hacer login")
    }
}

export async function register(email, password, name) {
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
                    name: name
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
        throw new Error(error.message || "Error al hacer el registro")
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

export async function resetPasswordRequest(email) {
    try {
        const response_http = await fetch(
            ENVIRONMENT.URL_API + '/api/auth/reset-password-request', {
            method: 'POST',
            headers: {
                'Content-type': "application/json"
            },
            body: JSON.stringify({ email })
        })
        const response = await response_http.json()
        if (!response.ok) {
            throw new Error(response.message)
        }
        return response
    } catch (error) {
        throw new Error(error.message || "Error al solicitar restablecimiento de contraseña")
    }
}

export async function resetPassword(token, newPassword) {
    try {
        const response_http = await fetch(
            ENVIRONMENT.URL_API + '/api/auth/reset-password', {
            method: 'POST',
            headers: {
                'Content-type': "application/json",
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ newPassword })
        })
        const response = await response_http.json()
        if (!response.ok) {
            throw new Error(response.message)
        }
        return response
    } catch (error) {
        throw new Error(error.message || "Error al restablecer contraseña")
    }
}