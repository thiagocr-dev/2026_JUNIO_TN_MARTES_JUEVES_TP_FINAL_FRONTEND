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

export async function updateWorkspace(token, workspace_id, name, description = "") {
    try {
        const response_http = await fetch(
            ENVIRONMENT.URL_API + `/api/workspace/${workspace_id}`, {
            method: 'PUT',
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
        throw new Error(error.message || "Error al actualizar workspace")
    }
}

export async function inviteToWorkspace(token, workspace_id, invited_email, role = 'member') {
    try {
        const response_http = await fetch(
            ENVIRONMENT.URL_API + `/api/workspace/${workspace_id}/members`, {
            method: 'POST',
            headers: {
                'Content-type': "application/json",
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ invited_email, role })
        })
        const response = await response_http.json()
        if (!response.ok) {
            throw new Error(response.message)
        }
        return response
    } catch (error) {
        throw new Error(error.message || "Error al invitar al usuario")
    }
}

export async function getWorkspaceMembers(token, workspace_id) {
    try {
        const response_http = await fetch(
            ENVIRONMENT.URL_API + `/api/workspace/${workspace_id}/members`, {
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
        throw new Error(error.message || "Error al obtener miembros del workspace")
    }
}
