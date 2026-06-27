import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import useForm from '../../hooks/useForm'
import useRequest from '../../hooks/useRequest'
import { register } from '../../services/authService'

export const RegisterScreen = () => {
    const navigate = useNavigate()

    const {
        sendRequest: sendRequestRegister,
        loading: registerLoading,
        error: registerError,
        response: registerResponse
    } = useRequest()

    const initial_form_state = {
        name: '',
        email: '',
        password: ''
    }

    function onSubmit(formData) {
        console.log("Intentando registrar usuario:", formData)
        sendRequestRegister(
            () => register(formData.email, formData.password, formData.name)
        )
    }

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
                    <h1 style={{ color: '#FFFFFF', fontSize: '28px', marginBottom: '8px', fontWeight: 'bold' }}>Únete a Slack Clone</h1>
                    <p style={{ color: '#ABABAD', fontSize: '14px' }}>Recomendamos usar una dirección de correo de trabajo.</p>
                </div>

                {registerResponse?.ok ? (
                    <div style={{
                        background: 'rgba(46, 182, 125, 0.15)',
                        border: '1px solid #2EB67D',
                        borderRadius: '6px',
                        padding: '16px',
                        textAlign: 'center',
                        color: '#2EB67D',
                        marginBottom: '20px'
                    }}>
                        <h3 style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>¡Registro exitoso!</h3>
                        <p style={{ margin: 0, fontSize: '14px', color: '#D1D2D3' }}>
                            Te hemos enviado un correo para verificar tu cuenta. Por favor, revisa tu bandeja de entrada y haz clic en el enlace para poder iniciar sesión.
                        </p>
                        <button 
                            onClick={() => navigate('/login')}
                            style={{
                                marginTop: '16px',
                                background: '#2EB67D',
                                color: '#FFFFFF',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            Ir al Login
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '16px' }}>
                            <label htmlFor='name' style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: '#D1D2D3' }}>Nombre</label>
                            <input 
                                id='name' 
                                name='name' 
                                type='text' 
                                value={formState.name} 
                                onChange={handleChange}
                                required
                                placeholder="Tu nombre"
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

                        <div style={{ marginBottom: '24px' }}>
                            <label htmlFor='password' style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: '#D1D2D3' }}>Contraseña</label>
                            <input 
                                id='password' 
                                name='password' 
                                type='password' 
                                value={formState.password} 
                                onChange={handleChange}
                                required
                                placeholder="Al menos 6 caracteres"
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

                        <button 
                            disabled={registerLoading}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '4px',
                                border: 'none',
                                background: registerLoading ? '#4A154B' : '#611f69',
                                color: '#FFFFFF',
                                fontWeight: 'bold',
                                fontSize: '15px',
                                cursor: registerLoading ? 'not-allowed' : 'pointer',
                                transition: 'background 0.2s',
                            }}
                        >
                            {registerLoading ? 'Registrando...' : 'Registrarse'}
                        </button>

                        {registerError && (
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
                                {registerError}
                            </div>
                        )}
                    </form>
                )}

                <p style={{ marginTop: '24px', fontSize: '14px', color: '#ABABAD', textAlign: 'center' }}>
                    ¿Ya usas Slack? <Link to={'/login'} style={{ color: '#1264A3', textDecoration: 'none', fontWeight: 'bold' }}>Inicia sesión</Link>
                </p>
            </div>
        </div>
    )
}
