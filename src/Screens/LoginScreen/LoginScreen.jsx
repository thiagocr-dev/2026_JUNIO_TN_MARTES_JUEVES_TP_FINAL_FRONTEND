import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import useForm from '../../hooks/useForm'
import { login } from '../../services/authService'
import useRequest from '../../hooks/useRequest'

export const LoginScreen = () => {

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
            console.log('SE EJECUTO EL EFECTO')
            //si el login fue exitoso
            if (loginRequestResponse?.ok) {
                console.log("LOGIN EXITOSO")
                localStorage.setItem(
                    'auth_token',
                    loginRequestResponse?.data?.access_token
                )
                navigate('/home')
            }
        },
        [
            loginRequestResponse //me interesa que mi efecto se ejecute CADA VEZ que cambie mi estado de respuesta
        ]
    )

    // Para hacer reutilizable la logica de evento guardo la logican en un hook
    const { formState, handleChange, handleSubmit } = useForm(initial_form_state, onSubmit)

    return (
        <div>
            <h1>Iniciar sesion</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor='email'>Email</label>
                    <input id='email' name='email' type='email' value={formState.email} onChange={handleChange}></input>
                </div>
                <div>
                    <label htmlFor='password'>Contraseña</label>
                    <input id='password' name='password' type='password' value={formState.password} onChange={handleChange}></input>
                </div>

                <button disabled={loginRequestLoading || loginRequestResponse?.ok}>
                    {
                        loginRequestLoading
                            ? 'Iniciando sesión...'
                            : 'Iniciar sesión'
                    }
                </button>
                {
                    loginRequestError && !loginRequestLoading &&
                    <>
                        <br />
                        <span style={{ color: 'red' }}>Error: {loginRequestError}</span>
                    </>
                }
            </form>
            <p>Si no tienes cuenta <Link to={'/register'}>Registrate</Link></p>
        </div>
    )
}
