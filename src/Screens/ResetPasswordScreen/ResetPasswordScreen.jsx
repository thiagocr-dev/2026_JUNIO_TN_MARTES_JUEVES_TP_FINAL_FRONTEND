import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import useForm from '../../hooks/useForm'
import useRequest from '../../hooks/useRequest'
import { resetPasswordRequest, resetPassword } from '../../services/authService'

export const ResetPasswordScreen = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')

    const {
        sendRequest: sendResetRequest,
        loading: resetRequestLoading,
        error: resetRequestError,
        response: resetRequestResponse
    } = useRequest()

    const {
        sendRequest: sendConfirmRequest,
        loading: confirmLoading,
        error: confirmError,
        response: confirmResponse
    } = useRequest()

    // ─── Scenario A: Requesting Reset Link (No token in URL) ───
    const initial_request_state = { email: '' }
    function onRequestSubmit(formData) {
        sendResetRequest(() => resetPasswordRequest(formData.email))
    }
    const { 
        formState: requestForm, 
        handleChange: handleRequestChange, 
        handleSubmit: handleRequestSubmit 
    } = useForm(initial_request_state, onRequestSubmit)

    // ─── Scenario B: Resetting Password (Token exists in URL) ───
    const initial_confirm_state = { newPassword: '', confirmPassword: '' }
    const [confirmMatchError, setConfirmMatchError] = useState('')

    function onConfirmSubmit(formData) {
        if (formData.newPassword !== formData.confirmPassword) {
            setConfirmMatchError('Las contraseñas no coinciden.')
            return
        }
        setConfirmMatchError('')
        sendConfirmRequest(() => resetPassword(token, formData.newPassword))
    }
    const { 
        formState: confirmForm, 
        handleChange: handleConfirmChange, 
        handleSubmit: handleConfirmSubmit 
    } = useForm(initial_confirm_state, onConfirmSubmit)

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
                    <h1 style={{ color: '#FFFFFF', fontSize: '24px', marginBottom: '8px', fontWeight: 'bold' }}>
                        {!token ? 'Restablecer contraseña' : 'Nueva contraseña'}
                    </h1>
                    <p style={{ color: '#ABABAD', fontSize: '14px' }}>
                        {!token 
                            ? 'Ingresa tu correo para recibir las instrucciones de recuperación.' 
                            : 'Elige una contraseña nueva y segura.'
                        }
                    </p>
                </div>

                {!token ? (
                    // Requesting reset email
                    resetRequestResponse?.ok ? (
                        <div style={{
                            background: 'rgba(46, 182, 125, 0.15)',
                            border: '1px solid #2EB67D',
                            borderRadius: '6px',
                            padding: '16px',
                            textAlign: 'center',
                            color: '#2EB67D',
                            marginBottom: '20px'
                        }}>
                            <p style={{ margin: 0, fontSize: '14px', color: '#D1D2D3' }}>
                                {resetRequestResponse.message || 'Se han enviado instrucciones a tu correo.'}
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
                                Volver al Login
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleRequestSubmit}>
                            <div style={{ marginBottom: '20px' }}>
                                <label htmlFor='email' style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: '#D1D2D3' }}>Email</label>
                                <input 
                                    id='email' 
                                    name='email' 
                                    type='email' 
                                    value={requestForm.email} 
                                    onChange={handleRequestChange}
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

                            <button 
                                disabled={resetRequestLoading}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '4px',
                                    border: 'none',
                                    background: resetRequestLoading ? '#4A154B' : '#611f69',
                                    color: '#FFFFFF',
                                    fontWeight: 'bold',
                                    fontSize: '15px',
                                    cursor: resetRequestLoading ? 'not-allowed' : 'pointer',
                                    transition: 'background 0.2s',
                                }}
                            >
                                {resetRequestLoading ? 'Enviando...' : 'Enviar enlace'}
                            </button>

                            {resetRequestError && (
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
                                    {resetRequestError}
                                </div>
                            )}
                        </form>
                    )
                ) : (
                    // Confirming reset (entering new password)
                    confirmResponse?.ok ? (
                        <div style={{
                            background: 'rgba(46, 182, 125, 0.15)',
                            border: '1px solid #2EB67D',
                            borderRadius: '6px',
                            padding: '16px',
                            textAlign: 'center',
                            color: '#2EB67D',
                            marginBottom: '20px'
                        }}>
                            <p style={{ margin: 0, fontSize: '14px', color: '#D1D2D3' }}>
                                Contraseña restablecida exitosamente. ¡Ya puedes iniciar sesión!
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
                                Iniciar sesión
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleConfirmSubmit}>
                            <div style={{ marginBottom: '16px' }}>
                                <label htmlFor='newPassword' style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: '#D1D2D3' }}>Nueva contraseña</label>
                                <input 
                                    id='newPassword' 
                                    name='newPassword' 
                                    type='password' 
                                    value={confirmForm.newPassword} 
                                    onChange={handleConfirmChange}
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

                            <div style={{ marginBottom: '24px' }}>
                                <label htmlFor='confirmPassword' style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: '#D1D2D3' }}>Confirmar nueva contraseña</label>
                                <input 
                                    id='confirmPassword' 
                                    name='confirmPassword' 
                                    type='password' 
                                    value={confirmForm.confirmPassword} 
                                    onChange={handleConfirmChange}
                                    required
                                    placeholder="Repite la contraseña"
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
                                disabled={confirmLoading}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '4px',
                                    border: 'none',
                                    background: confirmLoading ? '#4A154B' : '#611f69',
                                    color: '#FFFFFF',
                                    fontWeight: 'bold',
                                    fontSize: '15px',
                                    cursor: confirmLoading ? 'not-allowed' : 'pointer',
                                    transition: 'background 0.2s',
                                }}
                            >
                                {confirmLoading ? 'Restableciendo...' : 'Restablecer contraseña'}
                            </button>

                            {(confirmError || confirmMatchError) && (
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
                                    {confirmError || confirmMatchError}
                                </div>
                            )}
                        </form>
                    )
                )}

                <p style={{ marginTop: '24px', fontSize: '14px', color: '#ABABAD', textAlign: 'center' }}>
                    <Link to={'/login'} style={{ color: '#1264A3', textDecoration: 'none', fontWeight: 'bold' }}>Volver al Inicio de Sesión</Link>
                </p>
            </div>
        </div>
    )
}
