import dotenv from 'dotenv';

dotenv.config();

export default{
    port:process.env.PORT,
    mongo:{
        url:process.env.baseMongo||"mongodb+srv://Constanza:Konecta+865@products.fq2mz.mongodb.net/ecommerce?retryWrites=true&w=majority"
    },
    session:{
        SUPERADMIN:process.env.SUPERADMIN,
        SUPERADMIN_PASSWORD:process.env.SUPERADMIN_PASSWORD
    },
    jwt:{
        SECRET:process.env.JWT_SECRET,
        COOKIE_NAME:process.env.JWT_COOKIE_NAME,
    },
    env:{
        NODE_ENV:process.env.NODE_ENV||'PROD'
    },
    mns:{
        appG:process.env.appG||"jktrhwwbakfegqnz",
        CORREOEMPRESA:process.env.CORREOEMPRESA||'carnetconstanza@gmail.com'
    }
}