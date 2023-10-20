import { useRef, useState, createContext } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import './App.css';
import SetUsername from './Pages/SetUsername';
import InitialPage from './Pages/InitialPage';
import Game from './Game';
import { getCard, isBadObstacleCard, isBonusObstacleCard } from './CardsMapping';

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
    const myTurnRef = useRef(false)
    const [theirTurn, setTheirTurn] = useState('')
    const [takenCard, setTakenCard] = useState(null)
    const [whoTookCard, setWhoTookCard] = useState('')
    const [myHand, setMyHand] = useState([])
    const [gameBegun, setGameBegun] = useState(false)
    const [startButton, setStartButton] = useState(false)
    const [actionsStack, setActionsStack] = useState([])
    const actionStackRef = useRef([])
    const myCurrentObstacle = useRef(null)
    const [noNeedToDrawCard, setNoNeedToDrawCard] = useState(false)
    const [mysteriousPresent, setMysteriousPresent] = useState(false)

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

                myTurnRef.current = true
                setMyTurn(myTurnRef.current)
                setTheirTurn('')
            }

            if(message.protocol === "THEIR_TURN") {
                setTakenCard(null)
                setWhoTookCard('')

                myTurnRef.current = false
                setMyTurn(myTurnRef.current)
                setTheirTurn(message.current_player)
            }

            if(message.protocol === "YOU_TOOK_CARD") {
                if(isBadObstacleCard(message.card) || isBonusObstacleCard(message.card)){
                    myCurrentObstacle.current = message.card
                    // Se for carta do presente misterioso
                    if(myCurrentObstacle.current === 83 || myCurrentObstacle.current === 84) {
                        setMysteriousPresent(true)
                    } else {
                        setMysteriousPresent(false)
                    }
                } else {
                    myCards.current = [...myCards.current, message.card]
                    setMyHand(myCards.current)
                }
            }

            if(message.protocol === "PLAYER_TOOK_CARD") {
                if(message.card === "ACTION_CARD") {
                    setTakenCard("ACTION_CARD")
                } else {
                    setTakenCard(message.card)
                }
                setWhoTookCard(message.player)
            }

            if(message.protocol === "ACTION_STACK_ADD") {

                // SE FOR A CARTA DE TÔ FORA (Basta ela estar na pilha de cartas de ações para impedir o jogador de puxar carta)
                if(message["card_id"] === 20 || message["card_id"] === 21) {
                    console.log(myTurnRef.current, "MY TURN")
                    if(myTurnRef.current) {
                        setNoNeedToDrawCard(true)
                        console.log("NO NEED TO DRAW CARD", noNeedToDrawCard)
                    }
                }

                actionStackRef.current = [...actionStackRef.current, message.card_id]
                setActionsStack([...actionStackRef.current])
            }

            if(message.protocol === "ACTION_STACK_REMOVE") {
                if (message.executeActionsBefore) {
                    actionStackRef.current.splice(actionStackRef.current.length-2, 1)
                } else {
                    actionStackRef.current.pop()
                }
                // SE A CARTA "TÔ FORA ESTIVER PRESENTE NA PILHA, IMPEDIR DE PUXAR CARTA DO BOLO, SE NÃO, PODE PUXAR"
                if(actionStackRef.current.includes(20) || actionStackRef.current.includes(21)) {
                    if(myTurnRef.current) {
                        setNoNeedToDrawCard(true)
                    }
                } else {
                    if(myTurnRef.current) {
                        setNoNeedToDrawCard(false)
                    }
                }
                setActionsStack([...actionStackRef.current])
            }

            if(message.protocol === "CARD_ACTION") {
                if(message.action === "BLOCK_ACTIONS"){ // Carta de bloquear outra ação foi executada
                    const blocked_card = actionStackRef.current.pop()
                    // SE A CARTA BLOQUEADA FOI A DE "TÔ FORA"
                    if(blocked_card === 20 || blocked_card === 21){
                        console.log('SETTING NO NEED TO DRAW CARD TO FALSE')
                        setNoNeedToDrawCard(false)
                    }
                    setActionsStack([...actionStackRef.current])
                }

                if(message.action === "NEXT_3_CARDS") { // Carta de ver as próximas 3 cartas do baralho
                    const next_cards = message.cards.reverse()
                    alert(`As próximas 3 cartas são, nessa ordem:\n
                    ${getCard(next_cards[0]).name} (${getCard(next_cards[0]).description});\n
                    ${getCard(next_cards[1]).name} (${getCard(next_cards[1]).description});\n
                    ${getCard(next_cards[2]).name};(${getCard(next_cards[1]).description})`)
                }

                if(message.action === "NO_NEED_TO_DRAW_CARD") { // Carta de não ser obrigado a puxar carta
                    setNoNeedToDrawCard(true)
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
                        user, room: params.roomId, connection, roomPlayers, myCards, actionStackRef, myCurrentObstacle, myTurnRef
                    }}>
                        <Game 
                            startButton={startButton}
                            myHand={myHand}
                            setMyHand={setMyHand}
                            myTurn={myTurn}
                            theirTurn={theirTurn}
                            takenCard={takenCard}
                            noNeedToDrawCard={noNeedToDrawCard}
                            setNoNeedToDrawCard={setNoNeedToDrawCard}
                            whoTookCard={whoTookCard}
                            setWhoTookCard={setWhoTookCard}
                            gameBegun={gameBegun}
                            roomUsers={roomUsers}
                            actionsStack={actionsStack}
                            mysteriousPresent={mysteriousPresent}
                            setMysteriousPresent={setMysteriousPresent}
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
