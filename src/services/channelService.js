import ENVIRONMENT from "../config/environment"

export async function getChannels(token, workspace_id) {
    try {
        const response_http = await fetch(
            ENVIRONMENT.URL_API + `/api/channel/${workspace_id}`, {
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
        throw new Error("Error al obtener canales")
    }
}

export async function createChannel(token, workspace_id, nombre, descripcion = "") {
    try {
        const response_http = await fetch(
            ENVIRONMENT.URL_API + '/api/channel', {
            method: 'POST',
            headers: {
                'Content-type': "application/json",
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                nombre,
                descripcion,
                workspace_id
            })
        })
        const response = await response_http.json()
        if (!response.ok) {
            throw new Error(response.message)
        }
        return response
    } catch (error) {
        throw new Error("Error al crear canal")
    }
}
