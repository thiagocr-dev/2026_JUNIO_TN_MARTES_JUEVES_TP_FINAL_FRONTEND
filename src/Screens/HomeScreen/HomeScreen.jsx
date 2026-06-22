import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useNavigate } from 'react-router'

export const HomeScreen = () => {

    const navigate = useNavigate()
    const { isLogged, logout, userData } = useContext(AuthContext)
    console.log('El usuario con sesion activa actualmente es:', userData)

    function handleLogout() {
        logout()
        navigate('/login')
    }

    if (!userData) {
        return <h2>Cargando...</h2>
    }

    return (
        <div>
            <h1>Bienvenido nuevamente {userData.nombre}</h1>

            <button onClick={handleLogout}>Cerrar sesion</button>
        </div>
    )
}
