import ENVIRONMENT from "../config/environment"

export async function getMessages(token, channel_id) {
    try {
        const response_http = await fetch(
            ENVIRONMENT.URL_API + `/api/message/${channel_id}`, {
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
        throw new Error("Error al obtener mensajes")
    }
}

export async function sendMessage(token, channel_id, contenido) {
    try {
        const response_http = await fetch(
            ENVIRONMENT.URL_API + '/api/message', {
            method: 'POST',
            headers: {
                'Content-type': "application/json",
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                contenido,
                channel_id
            })
        })
        const response = await response_http.json()
        if (!response.ok) {
            throw new Error(response.message)
        }
        return response
    } catch (error) {
        throw new Error("Error al enviar mensaje")
    }
}
