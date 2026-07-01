import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import useForm from '../../hooks/useForm'
import { login } from '../../services/authService'
import useRequest from '../../hooks/useRequest'
import { AuthContext } from '../../context/AuthContext'
import './LoginScreen.css'

export const LoginScreen = () => {

    const { login: syncroLogin } = useContext(AuthContext) // para sincronizar 
    const navigate = useNavigate()

    const {
        sendRequest: sendRequestLogin,
        loading: loginRequestLoading,
        error: loginRequestError,
        response: loginRequestResponse
    } = useRequest()

    /* const [searchParams, setSearchParams] = useSearchParams() */ // 1.
    /* alert(searchParams.get('test')) */ //2. con el querystring http://localhost:5173/login?test=juan recibo una alerta con el nombre de juan
    const initial_form_state = {
        email: '',
        password: ''
    }

    function onSubmit(formData) {
        console.log("un usuario intentó iniciar sesion", formData)
        sendRequestLogin(
            () => login(formData.email, formData.password)
        )
    }

    console.log(
        {
            loginRequestLoading,
            loginRequestError,
            loginRequestResponse
        }
    )

    /* 
    controla la ejecucion de una funcionalidad
    */
    useEffect(
        () => {
            //si el login fue exitoso
            if (loginRequestResponse?.ok) {
                const handleSuccess = async () => {
                    await syncroLogin(loginRequestResponse?.data?.access_token)
                    navigate('/workspaces')
                }
                handleSuccess()
            }
        },
        [
            loginRequestResponse //me interesa que mi efecto se ejecute CADA VEZ que cambie mi estado de respuesta
        ]
    )

    // Para hacer reutilizable la logica de evento guardo la logican en un hook
    const { formState, handleChange, handleSubmit } = useForm(initial_form_state, onSubmit)

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-header">
                    <h1 className="login-title">Iniciar sesión</h1>
                    <p className="login-subtitle">Usa tus credenciales de Slack Clone.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="login-form-group">
                        <label htmlFor='email' className="login-label">Email</label>
                        <input 
                            id='email' 
                            name='email' 
                            type='email' 
                            value={formState.email} 
                            onChange={handleChange}
                            required
                            placeholder="nombre@trabajo.com"
                            className="login-input"
                        />
                    </div>

                    <div className="login-form-group-sm">
                        <label htmlFor='password' className="login-label">Contraseña</label>
                        <input 
                            id='password' 
                            name='password' 
                            type='password' 
                            value={formState.password} 
                            onChange={handleChange}
                            required
                            placeholder="Tu contraseña"
                            className="login-input"
                        />
                    </div>

                    <div className="login-links-container">
                        <Link to={'/reset-password'} className="login-link">
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>

                    <button 
                        disabled={loginRequestLoading || loginRequestResponse?.ok}
                        className="login-btn"
                    >
                        {loginRequestLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                    </button>

                    {loginRequestError && !loginRequestLoading && (
                        <div className="login-error">
                            {loginRequestError}
                        </div>
                    )}
                </form>
                <p className="login-footer">
                    ¿No tienes cuenta? <Link to={'/register'} className="login-footer-link">Regístrate</Link>
                </p>
            </div>
        </div>
    )
}
