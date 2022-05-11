import { createTransport } from "nodemailer";
import config from "../config/config.js"



const transporter = createTransport({
    service:"gmail",
    port: 587,
    auth: {
        user: config.mns.CORREOEMPRESA,
        pass: config.mns.appG
    }
});

function sendMail(email,carrito){

    const mail = {
        from:"Compra realizada! \(★ω★)/",
        to:email,
        subject:"Le estaremos enviando el seguimiento de su compra ",
        html:`
            <h1>Su compra:</h1>
            <p>numero de tk: ${carrito}</p>
           `
    };

    try {
        const result = await transporter.sendMail(mail)
        return {messages:'Revisa tu casilla de mensajes para validar la compra'}
    } catch (error) {
        return error
    }
}


export default sendMail;