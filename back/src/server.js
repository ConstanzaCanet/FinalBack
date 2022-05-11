import express from "express";
import passport from "passport";
import __dirname from "./utils.js"
import initializePassport from "./config/passport-config.js";
import sessionRouter from "./router/session.js";
import productsRouter from "./router/productsRouter.js";
import userRuter from "./router/userRuter.js";
import cartRouter from "./router/cartRouter.js";
import cookieParser from "cookie-parser";
import { createLogger } from "./utils.js";
import config from "./config/config.js";
import {Server} from 'socket.io'
import cors from 'cors';
import { chatService } from "./services/services.js";




const app = express();
const PORT = process.env.PORT;
const server = app.listen(PORT,()=>console.log('escuchando desde el puerto '+PORT))
const logger = createLogger(config.env.NODE_ENV)

/*cors */

const io = new Server(server,{
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
      }
})
app.use(cors({credentials:true, origin:"http://localhost:3000"}))
/*configuro como recibo info*/
app.use(express.json());
app.use(express.static(__dirname+'/public'))
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())
/*middle passport */
initializePassport();
app.use(passport.initialize())

/*ruteo basicon */
app.use('/api/products',productsRouter)
app.use('/api/session',sessionRouter)
app.use('/api/carts', cartRouter)
app.use('/users', userRuter)





let connectedSockets = {};
io.on('connection', async socket=>{
    console.log("client connected");
    if(socket.handshake.query.name){

        if(!Object.values(connectedSockets).some(user=>user.id===socket.handshake.query.id)){
            connectedSockets[socket.id]={
                name:socket.handshake.query.name,
                id:socket.handshake.query.id,
                thumbnail:socket.handshake.query.thumbnail
            };
        }
    }
    io.emit('users',connectedSockets)
    let logs = await chatService.getAllAndPopulate();
    io.emit('logs',logs);

    socket.on('disconnect', async reason=>{
        delete connectedSockets[socket.id]
        console.log("client disconnected: " + reason)

        io.emit('users',connectedSockets)
        let logs = await chatService.getAllAndPopulate();
        io.emit('logs',logs);
    })
    socket.on('message',async data=>{
        console.log(data)
        console.log(Object.keys(connectedSockets).includes(socket.id))
        if(Object.keys(connectedSockets).includes(socket.id)){
            await chatService.save({
                author:connectedSockets[socket.id].id,
                content: data
            })
            
            let logs = await chatService.getAllAndPopulate();
            io.emit('logs',logs);
        }
    });
})







/*Configuro Winston como logger*/
app.use((req,res,next)=>{
    logger.log('info',`${req.method} at ${req.path}`)
    next()
});

app.on('error',(error)=>{
    logger.warn("Advertencia! Algo anda fallando")
})
app.get('/*',(req,res)=>{
    logger.warn("Endpoint invalido")
    res.status(404).send({error:'Invalid endpoint'})
})