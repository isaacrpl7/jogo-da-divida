import { useRef, useState, createContext, useEffect } from 'react';
import { useParams } from "react-router-dom";
import './App.css';
import SetUsername from './Pages/SetUsername';
import InitialPage from './Pages/InitialPage';
import Game from './Game';

export const GameContext = createContext()

function App() {
    const params = useParams()
    const connection = useRef(null)
    const user = useRef(window.localStorage.username)
    const [messageQueue, setMessageQueue] = useState([])

    /** PAGE CONTROL */
    const [userReady, setUserReady] = useState(false)

    /** GAME PAGE */
    const roomPlayers = useRef([])

    async function conectar() {
        connection.current = new WebSocket(`${process.env.REACT_APP_PROTOCOL === 'http' ? 'ws' : 'wss'}://${process.env.REACT_APP_API_ADDRESS}?user=${user.current}&user_token=${window.localStorage.user_token}`, 'json')
        connection.current.onmessage = (messageevent) => {
            const message = JSON.parse(messageevent.data)
            if(message.protocol === "CREATING_USER") {
                window.localStorage.user_token = message.token
            } else {
                setMessageQueue((prevState) => [...prevState, message])
            }
        }
        connection.current.onopen = () => {
            console.log('Connected!', params.roomId)
            if(params.roomId) {
                console.log('Sending enter room!')
                connection.current.send(JSON.stringify({protocol: 'ENTER_ROOM', room: params.roomId}))
            }
        }
        connection.current.onerror = () => {
            console.log('onerror fired')
        }
        connection.current.onclose = (event) => {
            console.log('onclose fired')
            console.log(`Code: ${event.code}`)
            console.log(`Reason: ${event.reason}`)
            console.log(`Clean closing: ${event.wasClean}`)
            setTimeout(() => {
                console.log('Reconnecting...')
                conectar()
            }, Math.floor(Math.random() * 100))
        }
    }

    useEffect(() => {
        // Se estiver entrando em uma sala, e o usuário/token já estiver configurado, ele conecta de vez sem mostrar caixinha de setar usuário
        if(user.current && window.localStorage.user_token && params.roomId) {
            setUserReady(true)
            conectar()
        }
        // eslint-disable-next-line
    }, [])

    return (
        <div className="App">
            <button onClick={() => {connection.current.close()}}>Desconectar</button>
            {userReady ? 
                (params.roomId ? 
                    <GameContext.Provider value={{
                        user, room: params.roomId, connection, roomPlayers, messageQueue, setMessageQueue
                    }}>
                        <Game /> 
                    </GameContext.Provider>
                : 
                    <InitialPage user={user} connection={connection} /> ) 
            :
                <SetUsername user={user} conectar={conectar} setUserReady={setUserReady} />}
        </div>
    );
}

export default App;
