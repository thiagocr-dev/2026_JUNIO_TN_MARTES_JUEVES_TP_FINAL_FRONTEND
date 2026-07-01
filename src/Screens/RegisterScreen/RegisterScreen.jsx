import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import useForm from '../../hooks/useForm'
import useRequest from '../../hooks/useRequest'
import { register } from '../../services/authService'
import './RegisterScreen.css'

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
        <div className="register-container">
            <div className="register-box">
                <div className="register-header">
                    <h1 className="register-title">Únete a Slack Clone</h1>
                    <p className="register-subtitle">Recomendamos usar una dirección de correo de trabajo.</p>
                </div>

                {registerResponse?.ok ? (
                    <div className="register-success-box">
                        <h3 className="register-success-title">¡Registro exitoso!</h3>
                        <p className="register-success-text">
                            Te hemos enviado un correo para verificar tu cuenta. Por favor, revisa tu bandeja de entrada y haz clic en el enlace para poder iniciar sesión.
                        </p>
                        <button 
                            onClick={() => navigate('/login')}
                            className="register-success-btn"
                        >
                            Ir al Login
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="register-form-group">
                            <label htmlFor='name' className="register-label">Nombre</label>
                            <input 
                                id='name' 
                                name='name' 
                                type='text' 
                                value={formState.name} 
                                onChange={handleChange}
                                required
                                placeholder="Tu nombre"
                                className="register-input"
                            />
                        </div>

                        <div className="register-form-group">
                            <label htmlFor='email' className="register-label">Email</label>
                            <input 
                                id='email' 
                                name='email' 
                                type='email' 
                                value={formState.email} 
                                onChange={handleChange}
                                required
                                placeholder="nombre@trabajo.com"
                                className="register-input"
                            />
                        </div>

                        <div className="register-form-group-last">
                            <label htmlFor='password' className="register-label">Contraseña</label>
                            <input 
                                id='password' 
                                name='password' 
                                type='password' 
                                value={formState.password} 
                                onChange={handleChange}
                                required
                                placeholder="Al menos 6 caracteres"
                                className="register-input"
                            />
                        </div>

                        <button 
                            disabled={registerLoading}
                            className="register-btn"
                        >
                            {registerLoading ? 'Registrando...' : 'Registrarse'}
                        </button>

                        {registerError && (
                            <div className="register-error">
                                {registerError}
                            </div>
                        )}
                    </form>
                )}

                <p className="register-footer">
                    ¿Ya usas Slack? <Link to={'/login'} className="register-footer-link">Inicia sesión</Link>
                </p>
            </div>
        </div>
    )
}
