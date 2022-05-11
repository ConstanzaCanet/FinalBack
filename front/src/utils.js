import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

export const isLogin = () =>{
    if(process.env.REACT_APP_AUTHENTICATION_MODE==="COOKIE"){
        let cookies = Cookies.get(process.env.REACT_APP_COOKIE_NAME)
        console.log(cookies);
        if(!cookies){
            localStorage.clear();
            return false;
        }else{
            return cookies;
        }
    }
    else if(process.env.REACT_APP_AUTHENTICATION_MODE==="LOCAL_STORAGE"){
        const token = localStorage.getItem('sessionToken');
        return token !==null;
    }
}

export const getAuthHeaders = () =>{
    const token = localStorage.getItem('sessionToken');
    return {
        headers:{
            Authorization:`Bearer ${token}`,
            Accept:'application/json'
        },
        withCredentials:true
    }
}

export const showToast = ({type,text}) =>{
    const Toast = Swal.mixin({
        toast:true,
        position:'top-end',
        showConfirmButton:false,
        timer:3000,
        timerProgressBar:true,
        didOpen:(toast)=>{
            toast.addEventListener('mouseenter',Swal.stopTimer);
            toast.addEventListener('mouseleave',Swal.resumeTimer);
        }
    })

    Toast.fire({
        icon:type,
        title:text
    })
}

/**
 * NAVBAR OPTIONS
 */

export const options = [
    {path:'/',label:'Home',showWhen:true},
    {path:'/chat',label:'Chat',showWhen:'user'},
    {path:'/cart',label:'Carrito',showWhen:'user'},
    {path:'/newproduct',label:'Nuevo Producto',showWhen:'superadmin'},
    {path:'/users',label:'Usuarios',showWhen:'superadmin'}
]