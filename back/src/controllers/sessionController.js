import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import { serialize } from '../utils.js';


const register = async (req,res)=>{
    let file = req.file;
    try {
        res.send({status:"success",message:'user registrado!'})    
    } catch (error) { }
}

const current = async(req,res)=>{
    let user=serialize(req.user,["first_name","last_name","role","profile_picture","cart"])
    res.send({status:"success",payload:user})
}

const login= async (req,res)=>{
    let user = {};
    if(req.user.role==="superadmin"){
        user=req.user;
    }else{
        user = serialize(req.user,['first_name', 'last_name'])
    }
    let token = jwt.sign(user, config.jwt.SECRET)
    res.cookie('sessionCookie','boom',{
        maxAge:60*60*1000
    })
    res.cookie(config.jwt.COOKIE_NAME,token,{
        httpOnly:true,
        maxAge:60*60*1000
    })
    res.send({status:"success",payload:{user}})
}


const logout = async (req,res)=>{
    try {        
        res.clearCookie('JWT_COOKIE')
        res.send({message:"Hasta luego amigo! te has deslogueado"})
    } catch (error) { }
}

export default{
    register,current,login,logout
}