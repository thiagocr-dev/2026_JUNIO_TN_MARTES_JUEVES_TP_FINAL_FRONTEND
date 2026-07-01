import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import useForm from '../../hooks/useForm'
import useRequest from '../../hooks/useRequest'
import { resetPasswordRequest, resetPassword } from '../../services/authService'
import './ResetPasswordScreen.css'

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
        <div className="reset-container">
            <div className="reset-box">
                <div className="reset-header">
                    <h1 className="reset-title">
                        {!token ? 'Restablecer contraseña' : 'Nueva contraseña'}
                    </h1>
                    <p className="reset-subtitle">
                        {!token 
                            ? 'Ingresa tu correo para recibir las instrucciones de recuperación.' 
                            : 'Elige una contraseña nueva y segura.'
                        }
                    </p>
                </div>

                {!token ? (
                    // Requesting reset email
                    resetRequestResponse?.ok ? (
                        <div className="reset-success-box">
                            <p className="reset-success-text">
                                {resetRequestResponse.message || 'Se han enviado instrucciones a tu correo.'}
                            </p>
                            <button 
                                onClick={() => navigate('/login')}
                                className="reset-success-btn"
                            >
                                Volver al Login
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleRequestSubmit}>
                            <div className="reset-form-group">
                                <label htmlFor='email' className="reset-label">Email</label>
                                <input 
                                    id='email' 
                                    name='email' 
                                    type='email' 
                                    value={requestForm.email} 
                                    onChange={handleRequestChange}
                                    required
                                    placeholder="nombre@trabajo.com"
                                    className="reset-input"
                                />
                            </div>

                            <button 
                                disabled={resetRequestLoading}
                                className="reset-btn"
                            >
                                {resetRequestLoading ? 'Enviando...' : 'Enviar enlace'}
                            </button>

                            {resetRequestError && (
                                <div className="reset-error">
                                    {resetRequestError}
                                </div>
                            )}
                        </form>
                    )
                ) : (
                    // Confirming reset (entering new password)
                    confirmResponse?.ok ? (
                        <div className="reset-success-box">
                            <p className="reset-success-text">
                                Contraseña restablecida exitosamente. ¡Ya puedes iniciar sesión!
                            </p>
                            <button 
                                onClick={() => navigate('/login')}
                                className="reset-success-btn"
                            >
                                Iniciar sesión
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleConfirmSubmit}>
                            <div className="reset-form-group-sm">
                                <label htmlFor='newPassword' className="reset-label">Nueva contraseña</label>
                                <input 
                                    id='newPassword' 
                                    name='newPassword' 
                                    type='password' 
                                    value={confirmForm.newPassword} 
                                    onChange={handleConfirmChange}
                                    required
                                    placeholder="Al menos 6 caracteres"
                                    className="reset-input"
                                />
                            </div>

                            <div className="reset-form-group-last">
                                <label htmlFor='confirmPassword' className="reset-label">Confirmar nueva contraseña</label>
                                <input 
                                    id='confirmPassword' 
                                    name='confirmPassword' 
                                    type='password' 
                                    value={confirmForm.confirmPassword} 
                                    onChange={handleConfirmChange}
                                    required
                                    placeholder="Repite la contraseña"
                                    className="reset-input"
                                />
                            </div>

                            <button 
                                disabled={confirmLoading}
                                className="reset-btn"
                            >
                                {confirmLoading ? 'Restableciendo...' : 'Restablecer contraseña'}
                            </button>

                            {(confirmError || confirmMatchError) && (
                                <div className="reset-error">
                                    {confirmError || confirmMatchError}
                                </div>
                            )}
                        </form>
                    )
                )}

                <p className="reset-footer">
                    <Link to={'/login'} className="reset-footer-link">Volver al Inicio de Sesión</Link>
                </p>
            </div>
        </div>
    )
}
