import ENVIRONMENT from "../config/environment"

export async function getWorkspaces(token) {
    try {
        const response_http = await fetch(
            ENVIRONMENT.URL_API + '/api/workspace', {
            method: 'GET',
            headers: {
                'Content-type': "application/json",
                'Authorization': `Bearer ${token}`
            }
        })
        const response = await response_http.json()
        if (!response.ok) {
            throw new Error(response.message)
        }
        return response
    } catch (error) {
        throw new Error("Error al obtener workspaces")
    }
}

export async function createWorkspace(token, name, description = "") {
    try {
        const response_http = await fetch(
            ENVIRONMENT.URL_API + '/api/workspace', {
            method: 'POST',
            headers: {
                'Content-type': "application/json",
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                nombre: name,
                descripcion: description
            })
        })
        const response = await response_http.json()
        if (!response.ok) {
            throw new Error(response.message)
        }
        return response
    } catch (error) {
        throw new Error("Error al crear workspace")
    }
}

export async function deleteWorkspace(token, workspace_id) {
    try {
        const response_http = await fetch(
            ENVIRONMENT.URL_API + `/api/workspace/${workspace_id}`, {
            method: 'DELETE',
            headers: {
                'Content-type': "application/json",
                'Authorization': `Bearer ${token}`
            }
        })
        const response = await response_http.json()
        if (!response.ok) {
            throw new Error(response.message)
        }
        return response
    } catch (error) {
        throw new Error("Error al eliminar workspace")
    }
}
