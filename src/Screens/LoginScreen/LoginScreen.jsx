import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import useForm from '../../hooks/useForm'
import { login } from '../../services/authService'
import useRequest from '../../hooks/useRequest'
import { AuthContext } from '../../context/AuthContext'

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
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: '#1A1D21',
            color: '#D1D2D3',
            fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            padding: '20px'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '400px',
                background: '#222529',
                padding: '40px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <h1 style={{ color: '#FFFFFF', fontSize: '28px', marginBottom: '8px', fontWeight: 'bold' }}>Iniciar sesión</h1>
                    <p style={{ color: '#ABABAD', fontSize: '14px' }}>Usa tus credenciales de Slack Clone.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '16px' }}>
                        <label htmlFor='email' style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: '#D1D2D3' }}>Email</label>
                        <input 
                            id='email' 
                            name='email' 
                            type='email' 
                            value={formState.email} 
                            onChange={handleChange}
                            required
                            placeholder="nombre@trabajo.com"
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                borderRadius: '4px',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                background: '#1A1D21',
                                color: '#FFFFFF',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '8px' }}>
                        <label htmlFor='password' style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: '#D1D2D3' }}>Contraseña</label>
                        <input 
                            id='password' 
                            name='password' 
                            type='password' 
                            value={formState.password} 
                            onChange={handleChange}
                            required
                            placeholder="Tu contraseña"
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                borderRadius: '4px',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                background: '#1A1D21',
                                color: '#FFFFFF',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <div style={{ textAlign: 'right', marginBottom: '24px' }}>
                        <Link to={'/reset-password'} style={{ color: '#1264A3', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold' }}>
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>

                    <button 
                        disabled={loginRequestLoading || loginRequestResponse?.ok}
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '4px',
                            border: 'none',
                            background: loginRequestLoading ? '#4A154B' : '#611f69',
                            color: '#FFFFFF',
                            fontWeight: 'bold',
                            fontSize: '15px',
                            cursor: (loginRequestLoading || loginRequestResponse?.ok) ? 'not-allowed' : 'pointer',
                            transition: 'background 0.2s',
                        }}
                    >
                        {loginRequestLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                    </button>

                    {loginRequestError && !loginRequestLoading && (
                        <div style={{ 
                            color: '#E01E5A', 
                            marginTop: '16px', 
                            fontSize: '14px', 
                            textAlign: 'center',
                            background: 'rgba(224, 30, 90, 0.1)',
                            border: '1px solid rgba(224, 30, 90, 0.2)',
                            padding: '8px',
                            borderRadius: '4px'
                        }}>
                            {loginRequestError}
                        </div>
                    )}
                </form>
                <p style={{ marginTop: '24px', fontSize: '14px', color: '#ABABAD', textAlign: 'center' }}>
                    ¿No tienes cuenta? <Link to={'/register'} style={{ color: '#1264A3', textDecoration: 'none', fontWeight: 'bold' }}>Regístrate</Link>
                </p>
            </div>
        </div>
    )
}
