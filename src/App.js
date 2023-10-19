import { useRef, useState, createContext } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import './App.css';
import SetUsername from './Pages/SetUsername';
import InitialPage from './Pages/InitialPage';
import Game from './Game';

export const GameContext = createContext()

function App() {
    const params = useParams()
    const connection = useRef(null)
    const user = useRef(window.localStorage.username)
    const navigate = useNavigate()

    /** PAGE CONTROL */
    const [userReady, setUserReady] = useState(false)

    /** GAME PAGE */
    const [roomUsers, setRoomUsers] = useState([])
    const roomPlayers = useRef([])
    const myCards = useRef([])
    const [myTurn, setMyTurn] = useState(false)
    const [theirTurn, setTheirTurn] = useState('')
    const [takenCard, setTakenCard] = useState(null)
    const [whoTookCard, setWhoTookCard] = useState('')
    const [myHand, setMyHand] = useState([])
    const [gameBegun, setGameBegun] = useState(false)
    const [startButton, setStartButton] = useState(false)
    const [actionsStack, setActionsStack] = useState([])
    const actionStackRef = useRef([])

    async function conectar() {
        connection.current = new WebSocket(`ws://${process.env.REACT_APP_API_ADDRESS}?user=${user.current}`, 'json')
        connection.current.onmessage = (messageevent) => {
            const message = JSON.parse(messageevent.data)
            if(message.protocol === "ENTER_ROOM_FAILED") {
                navigate('/enter-room-failed')
            }

            if(message.protocol === "DELEGATE_START"){
                setStartButton(true)
            }

            if(message.protocol === "USER_ENTERED" || message.protocol === "USER_LEFT") {
                roomPlayers.current = message.users
                setRoomUsers(roomPlayers.current)
            }

            if(message.protocol === "INITIAL_CARDS") {
                myCards.current = message.cards
                setMyHand(myCards.current)
                setGameBegun(true)
            }

            if(message.protocol === "YOUR_TURN") {
                setTakenCard(null)
                setWhoTookCard('')

                setMyTurn(true)
                setTheirTurn('')
            }

            if(message.protocol === "THEIR_TURN") {
                setTakenCard(null)
                setWhoTookCard('')

                setMyTurn(false)
                setTheirTurn(message.current_player)
            }

            if(message.protocol === "YOU_TOOK_CARD") {
                myCards.current = [...myCards.current, message.card]
                setMyHand(myCards.current)
            }

            if(message.protocol === "PLAYER_TOOK_CARD") {
                setTakenCard(message.card)
                setWhoTookCard(message.player)
            }

            if(message.protocol === "ACTION_STACK_ADD") {
                actionStackRef.current = [...actionStackRef.current, message.card_id]
                setActionsStack([...actionStackRef.current])
            }

            if(message.protocol === "ACTION_STACK_REMOVE") {
                // eslint-disable-next-line
                let card_action = actionStackRef.current.pop()
                setActionsStack([...actionStackRef.current])
            }

            if(message.protocol === "CARD_ACTION") {
                if(message.action === "BLOCK_ACTIONS"){ // Carta de bloquear outra ação foi executada
                    actionStackRef.current.pop()
                    actionStackRef.current.pop()
                    setActionsStack([...actionStackRef.current])
                }
            }

            console.log(message)
        }
        connection.current.onopen = () => {
            if(params.roomId) {
                connection.current.send(JSON.stringify({protocol: 'ENTER_ROOM', room: params.roomId}))
            }
        }
    }

    async function criarSala() {
        const response = await fetch(`${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_API_ADDRESS}/criarSala`,
        {method: 'POST', headers: {
            "Content-Type": "application/json",
        }, body: JSON.stringify({user: user.current})});
        const room = await response.json()
        if(room.msg) {
            console.log(room.msg)
        }
        connection.current.send(JSON.stringify({protocol: 'ENTER_ROOM', room: room.id}))
        navigate(`/${room.id}`)
    }

    return (
        <div>
            {userReady ? 
                (params.roomId ? 
                    <GameContext.Provider value={{
                        user, room: params.roomId, connection, roomPlayers, myCards, actionStackRef
                    }}>
                        <Game 
                            startButton={startButton}
                            myHand={myHand}
                            setMyHand={setMyHand}
                            myTurn={myTurn}
                            theirTurn={theirTurn}
                            takenCard={takenCard}
                            setTakenCard={setTakenCard}
                            whoTookCard={whoTookCard}
                            setWhoTookCard={setWhoTookCard}
                            gameBegun={gameBegun}
                            roomUsers={roomUsers}
                            actionsStack={actionsStack}
                        /> 
                    </GameContext.Provider>
                : 
                    <InitialPage criarSala={criarSala} /> ) 
            :
                <SetUsername user={user} conectar={conectar} setUserReady={setUserReady} />}
        </div>
    );
}

export default App;
