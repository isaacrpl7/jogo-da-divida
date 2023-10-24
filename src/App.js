import { useRef, useState, createContext } from 'react';
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
        connection.current = new WebSocket(`ws://${process.env.REACT_APP_API_ADDRESS}?user=${user.current}`, 'json')
        connection.current.onmessage = (messageevent) => {
            const message = JSON.parse(messageevent.data)
            setMessageQueue((prevState) => [...prevState, message])
        }
        connection.current.onopen = () => {
            if(params.roomId) {
                connection.current.send(JSON.stringify({protocol: 'ENTER_ROOM', room: params.roomId}))
            }
        }
    }

    return (
        <div className="App">
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
