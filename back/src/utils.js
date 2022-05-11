import {fileURLToPath} from 'url';
import {dirname} from 'path';
import bcrypt from 'bcrypt';
import winston from 'winston';
import config from './config/config.js';


const filename = fileURLToPath(import.meta.url);
const __dirname = dirname(filename);


export const createHash = password=>bcrypt.hashSync(password,bcrypt.genSaltSync(10))
export const isValidPass = (user,password) => bcrypt.compareSync(password,user.password);
export const cookieExtractor = req =>{
    let token = null;
    if (req && req.cookies)
    {
        token = req.cookies[config.jwt.COOKIE_NAME];
    }
    return token;
}

export const createLogger=(env) =>{
    if(env === "PROD"){
        return winston.createLogger({
            transports:[
                new winston.transports.File({ filename:'loggers/combined.log'}),
                new winston.transports.File({filename:"loggers/errors.log",level:"error"})
            ]
        })
    }else{
        return winston.createLogger({
            level:'info',
            transports:[
                new winston.transports.Console({level:"info"})
            ]
        })
    }
}

export const serialize = (object,keys) =>{
    let serializedObject = Object.fromEntries(Object.entries(object).filter(pair=>keys.includes(pair[0])))
    serializedObject.id = object._id;
    return serializedObject;
}



export default __dirname;
