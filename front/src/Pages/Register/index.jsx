import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { sessionService } from '../../services';
import './register.scss';

const Register = () =>{
    let [input,setInput] = useState({
        first_name:{
            value:"",
            error:"",
        },
        last_name:{
            value:'',
            error:'',
        },
        email:{
            value:'',
            error:'',
        },
        phone:{
            value:'',
            error:'',
        },
        password:{
            value:'',
            error:'',
        }
    })
    const [image,setImage] = useState(null);
    const handleInputChange = (e) =>{
        setInput((prev) => ({
            ...prev,
            [e.target.name]: {
                value: e.target.value,
                error: null
            }
        }))
    }
    const handleImageChange = (e) =>{
        setImage(e.target.files[0])
    }
    const handleSubmit = (e) =>{
        e.preventDefault();
        let error = false
        Object.keys(input).forEach(key => {
            if (input[key].value.length === 0) {
                error = true;
                setInput((prev) => ({
                    ...prev,
                    [key]: {
                        ...prev[key],
                        error: "Completar este campo"
                    }
                }))
            }
        })
        if (!error) {
            let form = new FormData();
            form.append('first_name',input.first_name.value);
            form.append('last_name',input.last_name.value);
            form.append('email',input.email.value);
            form.append('phone',input.phone.value);
            form.append('password',input.password.value);
            form.append('profilePic',image)
            sessionService.register({body:form,callbackSuccess:callbackSuccessRegister,callbackError:callbackErrorRegister})
        }
    }
    useEffect(()=>{
        console.log(image);
    },[image])
    /*CALLBACKS */
    const callbackSuccessRegister = (response) =>{
        if(response.data.error){
            Swal.fire({
                icon:"error",
                title:"Cannot Register",
                text:response.data.error,
                timer:2000
            }).then(result=>{
                Object.keys(input).forEach(key=>setInput(prev=>({
                    ...prev,
                    [key]:{
                        error:'',
                        value:''
                    }
                })))
            })
        }else{
            Swal.fire({
                icon:"success",
                title:'Usuario Registrado',
                text:"Ahora puede identificarse",
                timer:2000
            }).then(result=>{
                window.location.replace('/login')
            })
        }
    }
    const callbackErrorRegister = (response) =>{
        console.log(response.data);
    }
    return(<div>
        <form>
            <label>Nombre</label>
            <input name="first_name" value={input.first_name.value} onChange={handleInputChange}/>
            {input.first_name.error&&<p style={{color:"red"}}>{input.first_name.error}</p>}
            <label>Apellido</label>
            <input name="last_name" value={input.last_name.value} onChange={handleInputChange}/>
            {input.first_name.error&&<p style={{color:"red"}}>{input.first_name.error}</p>}
            <label>email</label>
            <input name="email" value={input.email.value} onChange={handleInputChange}/>
            {input.first_name.error&&<p style={{color:"red"}}>{input.first_name.error}</p>}
            <label>Teléfono</label>
            <input name="phone" value={input.phone.value} onChange={handleInputChange}/>
            {input.first_name.error&&<p style={{color:"red"}}>{input.first_name.error}</p>}
            <label>Contraseña</label>
            <input  type="password" name="password" value={input.password.value} onChange={handleInputChange}/>
            {input.first_name.error&&<p style={{color:"red"}}>{input.first_name.error}</p>}
            <label>Imagen de perfil</label>
            <input type="file" name="profilePic" onChange={handleImageChange}/>
            <button onClick={handleSubmit}>Registrarse</button>
        </form>
    </div>)
}

export default Register;