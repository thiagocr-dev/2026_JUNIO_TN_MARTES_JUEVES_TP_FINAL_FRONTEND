import React from 'react'
import { Navigate, useSearchParams } from 'react-router'

export const ResetPasswordScreen = () => {
    
    const [searchParams, setSearchParams] = useSearchParams() // 1.
    const reset_password_token = searchParams.get('reset_password_token')
    // Hago una validacion para que si intenta entrar y no tiene token, no pueda acceder y vaya al LOGIN.
    if(!reset_password_token){  
        return <Navigate to={'/login'} />
    } 

    return (
        <div>
            <h1>Restablecer contraseña</h1>
            <form>

            </form>
        </div>
    )
}
