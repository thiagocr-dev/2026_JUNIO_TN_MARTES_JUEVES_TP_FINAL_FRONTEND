ASPECTOS esteticos nos encargamos nosotros

TRACKEAR FORMULARIO LO LLAMO ASI POR EL MOMENTO
export const LoginScreen = () => {

    const initial_form_state = {
        email: '',
        password: ''
    }

    // Para hacer reutilizable la logica de evento guardo la logican en un hook
    const {formState, handleChange} = useForm(initial_form_state)


    console.log(formState)

Para conectar con el servidor tenemos que hacer una consulta via http a nuestro sevidor. Esto lo permite fech, es una forma nativa de JavaScript
Por cada ENDPOINT vamos a tener que hacer un fetch

async function login(email , password){
    try{
        const response_http = await fetch(
            'http://localhost:8080/api/auth/login,{
                method: 'POST',
                headers: {       ESTOS HEADERS LOS TENEMOS QUE CONFIGURAR MANUAL Y LE DIGO EL TIPO DE DATO QUE LE ENVIO
                    'Content-type': "application/json"
                },
                body: JSON.stringify(    TRANSFORMO A JSON EL OBJETO QUE ENVIAMOS
                    {
                        email: email,
                        password: password
                    }   
                )
            }
        )
        const response = await response_http.json()
        return response
    }
    catch(error){
        throw new Error("Error al hacer login")
    }
}

lo instancio en LoginScrenn
 function onSubmit (formData){
        console.log("un usuario intentó iniciar sesion", formData)
        login(formData.email, formData.password)    
    }

Me sale ERROR de CORS (Cross origin resource sharing)
Este problema ocurre al consultar de otros servidores que son de otro origen al mio. En esta caso consulto de Chrome al local.

EJ, consulto desde el navegador en el localhost:5173 y en el servidor esta en el localhost:8080
Distinto de POSTMAN que hace un curl desde la computadora misma
curl -> emite consultas http desde consola. Un get basicamente.

El backend tiene que aceptar consultas de origen distintos, usamos una libreria.
1.  npm install cors

2. en el main.js (Back End) habilitamos las consultas de origen cruzado
Importamos cors from 'cors'
app.use(cors()) 

Tambien se puede personalizar de donde se pueden recibir consultas.