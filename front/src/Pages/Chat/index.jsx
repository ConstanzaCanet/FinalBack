import io from 'socket.io-client'
import { useEffect, useState } from 'react';
import MainContainer from '../../components/layout/MainContainer';
import './chat.scss'
const Chat = () => {
    let [socket,setSocket] = useState(null);
    let [usersConnected, setUsersConnected] = useState([])
    let [logs,setLogs] = useState([])
    let [message, setMessage] = useState('')
    const currentUser = JSON.parse(localStorage.getItem('user'));
    useEffect(() => {
        let actualSocket =io(process.env.REACT_APP_BASE_URL, {
            query: `name=${currentUser.first_name} ${currentUser.last_name}&id=${currentUser.id}&thumbnail=${currentUser.profile_picture}`
        })
        setSocket(actualSocket);
        return () => {
            actualSocket.close();
        }
    }, [])
    useEffect(()=>{
        if(socket){
            socket.on('users', (data) => {
                setUsersConnected(data);
            })
            socket.on('logs',data=>{
                setLogs(data)
            })
        }
    },[socket])
    const submitMessage = () =>{
        if(message.trim().length>0){
            //Puede enviarse el mensaje
            socket.emit('message',message);
        }
    }
    const handleMessageChange = (e) =>{
        setMessage(e.target.value)
    }
    const handleSendingMessage = (e) =>{
        if(e.key==="Enter"){
            if(e.target.value.trim().length>0){
                socket.emit('message',message.trim());
                e.target.value=""
                setMessage("")
            }
        }
    }
    return <MainContainer socket={socket}>
        <div className="chatHeader">

        </div>
        <div style={{ minHeight: "500px", display: "flex" }}>
            <div className="col1" style={{ outline: "2px solid burlywood" }}>
                <div style={{ backgroundColor: "burlywood", padding: "20px 0" }}>
                    <p style={{ textAlign: "center", margin: "0" }}>Usuarios en esta sala</p>
                </div>
                <div style={{ height: "87%" }}>
                    {
                        usersConnected ? Object.keys(usersConnected).slice(0, 10).map(key => {
                            return <div className="userCard">
                                <div style={{ paddingTop: "10px", marginRight: "10px" }}>
                                    <img className="thumbnail" src={usersConnected[key].thumbnail} />
                                </div>
                                <div style={{ display: "inline-block" }}>
                                    <p>{usersConnected[key].name}</p>
                                </div>
                            </div>
                        }) : null
                    }
                </div>
            </div>
            <div className="col2">
                <div style={{ padding: "0 5px 0 10px", display: "flex", height:"500px", flexDirection: "column", justifyContent: "space-between" }}>
                    <div style={{ overflowY: "auto" }} id="logsDiv">
                        {
                            logs?logs.map(message=><div style={{display:"flex"}}>
                                <img className="thumbnail_chat" src={message.author.profile_picture}></img>
                                <p>{message.content}</p>
                            </div>):null
                        }
                    </div>
                    <div style={{ paddingBottom: "25px" }}>
                        <div style={{ float: "left", width: "90%" }}>
                            <textarea style={{width:"95%",resize:"none"}} value={message} onKeyUpCapture={handleSendingMessage} onChange={handleMessageChange} ></textarea>
                        </div>
                        <div style={{ float: "left", width: "10%" }}>
                            <button className="chatButton" onClick={submitMessage}>ENVIAR</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </MainContainer>
}

export default Chat;