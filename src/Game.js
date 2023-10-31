import { useContext, useEffect, useRef, useState } from "react";
import SelectTargetUser from "./Pages/SelectTargetUser";
import ActionStack from "./GameTableComponents/ActionStack";
import CardTaken from "./GameTableComponents/CardTaken";
import MyCards from "./GameTableComponents/MyCards";
import { GameContext } from "./App";
import Pyramid from "./GameTableComponents/Pyramid";
import { getCard } from "./CardsMapping";
import { useNavigate } from "react-router-dom";

function Game() {

    const [selectTargetUser, setSelectTargetUser] = useState(false)
    const [cardToTransfer, setCardToTransfer] = useState(null)
    const [death, setDeath] = useState(false)
    const {room, user, connection, messageQueue, setMessageQueue} = useContext(GameContext)
    const navigate = useNavigate()

    // Initial lobby room
    const [roomUsers, setRoomUsers] = useState([])
    const [startButton, setStartButton] = useState(false)

    // Player state
    const [myHand, setMyHand] = useState([])
    const [myTurn, setMyTurn] = useState(false)
    const [theirTurn, setTheirTurn] = useState('')
    const myCurrentObstacle = useRef(null)
    const [mysteriousPresent, setMysteriousPresent] = useState(false)
    const [noNeedToDrawCard, setNoNeedToDrawCard] = useState(false)
    const [transferPyramidVisible, setTransferPyramidVisible] = useState(false)
    const [takenCard, setTakenCard] = useState(null)

    // Room state
    const [gameBegun, setGameBegun] = useState(false)
    const alivePlayers = useRef([])
    const [whoTookCard, setWhoTookCard] = useState('')
    const [pyramidPlayers, setPyramidPlayers] = useState([])
    const [actionsStack, setActionsStack] = useState([])


    async function handleStart() {
        await fetch(`${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_API_ADDRESS}/turno/${room}`);
    }

    function handleNextTurn() {
        if (actionsStack.length || transferPyramidVisible){
            alert('Faça suas ações antes de passar seu turno!')
        } else {
            // Se for uma carta de esquema de pirâmide
            if(myCurrentObstacle.current >= 26 && myCurrentObstacle.current <= 30 ){
                connection.current.send(JSON.stringify({protocol: 'OBSTACLE_ACTION', card_id: myCurrentObstacle.current}))
            }
            connection.current.send(JSON.stringify({protocol: 'NEXT_TURN'}))
        }
    }

    function handleTakeCard(){
        connection.current.send(JSON.stringify({protocol: 'TAKE_CARD'}))
    }

    function handleGameover(){
        if (actionsStack.length){
            alert('Faça suas ações antes de declarar morte!')
        } else {
            setSelectTargetUser(false)
            connection.current.send(JSON.stringify({protocol: 'GAMEOVER'}))
            setDeath(true)
        }
    }

    useEffect(() => {
        if(messageQueue.length) {
            const message = messageQueue[0];

            if(message.protocol === "ENTER_ROOM_FAILED") {
                navigate('/enter-room-failed')
            }

            if(message.protocol === "DELEGATE_START"){
                console.log('ATIVANDO BOTAO DE START')
                setStartButton(true)
            }
    
            if(message.protocol === 'USER_ENTERED') {
                alivePlayers.current = message.users
                setRoomUsers(message.users)
            }
            if(message.protocol === 'USER_LEFT') {
                alivePlayers.current = message.users
                setRoomUsers(message.users)
                alert(`Usuário ${message.user_leaving} saiu!`)
            }

            /** USER STATES */
            if(message.protocol === "SET_MY_HAND"){
                setMyHand(message.myHand)
            }
            if(message.protocol === "SET_MY_TURN"){
                setMyTurn(message.myTurn)
            }
            if(message.protocol === "SET_MY_CURRENT_OBSTACLE"){
                myCurrentObstacle.current = message.myCurrentObstacle
            }
            if(message.protocol === "SET_TAKEN_CARD"){
                setTakenCard(message.takenCard)
            }
            if(message.protocol === "SET_THEIR_TURN"){
                setTheirTurn(message.theirTurn)
            }
            if(message.protocol === "SET_MYTERIOUS_PRESENT"){
                setMysteriousPresent(message.mysteriousPresent)
            }
            if(message.protocol === "SET_NO_NEED_TO_DRAW_CARD"){
                setNoNeedToDrawCard(message.noNeedToDrawCard)
            }
            if(message.protocol === "SET_TRANSFER_PYRAMID_VISIBLE"){
                setTransferPyramidVisible(message.transferPyramidVisible)
            }

            /** ROOM STATES */
            if(message.protocol === "SET_GAME_BEGUN"){
                setGameBegun(message.gameBegun)
            }
            if(message.protocol === "SET_ALIVE_PLAYERS"){
                alivePlayers.current = message.alivePlayers
            }
            if(message.protocol === "SET_WHO_TOOK_CARD"){
                setWhoTookCard(message.whoTookCard)
            }
            if(message.protocol === "SET_PYRAMID_PLAYERS"){
                setPyramidPlayers(message.pyramidPlayers)
            }
            if(message.protocol === "SET_ACTIONS_STACK"){
                setActionsStack(message.actionsStack)
            }

            if(message.protocol === "WINNER"){
                if(message.winner === user.current) {
                    alert('Você ganhou o jogo. Parabéns!')
                } else {
                    alert(`${message.winner} ganhou o jogo! Podem ir dando os parabéns pra ele.`)
                }
            }

            if(message.protocol === "CARD_ACTION") {
                if(message.action === "NEXT_3_CARDS") { // Carta de ver as próximas 3 cartas do baralho
                    const next_cards = message.cards.reverse()
                    alert(`As próximas 3 cartas são, nessa ordem:\n
                    ${getCard(next_cards[0]).name} (${getCard(next_cards[0]).description});\n
                    ${getCard(next_cards[1]).name} (${getCard(next_cards[1]).description});\n
                    ${getCard(next_cards[2]).name};(${getCard(next_cards[1]).description})`)
                }
            }

            if(message.protocol === "OBSTACLE_ACTION") {
                if(message.action === "DISSOLVE_PYRAMID") {
                    alert("A pirâmide chegou no máximo de jogadores, portanto será dissolvida!")
                }
            }

            if(message.protocol === "CARDS_OVER"){
                alert("As cartas acabaram. Decidam entre si quem foi o vencedor!")
            }

            console.log(message)
            setMessageQueue(prevState => prevState.slice(1))
        }
    },[messageQueue, setMessageQueue, pyramidPlayers, user ,connection, navigate, myTurn, actionsStack]);

    
    return (
        <div className="App">
            <header className="App-header">

                { gameBegun ?
                    <>
                        <CardTaken 
                            takenCard={takenCard}
                            whoTookCard={whoTookCard} 
                            setMysteriousPresent={setMysteriousPresent} 
                            mysteriousPresent={mysteriousPresent} 
                            handleTakeCard={handleTakeCard} 
                            actionsStack={actionsStack}
                        />
                        {myTurn ? 
                            <>
                                <p>O turno é seu!</p>
                                {takenCard !== null || noNeedToDrawCard ? <button onClick={handleNextTurn}>Proximo turno</button> : <button onClick={handleTakeCard}>Puxar carta</button>}
                            </>
                        :
                            <>
                                <p>O turno é de {theirTurn}</p>
                            </>
                        }
                        <Pyramid
                            pyramidPlayers={pyramidPlayers}
                            setPyramidPlayers={setPyramidPlayers}
                        />

                        {actionsStack.length !== 0 && <ActionStack 
                            actionsStack={actionsStack} 
                            roomUsers={roomUsers}
                            myCurrentObstacle={myCurrentObstacle} 
                            myTurn={myTurn} 
                            theirTurn={theirTurn}
                        />}

                        {transferPyramidVisible && <SelectTargetUser
                            setSelectTargetUser={setTransferPyramidVisible}
                            isTransferObstacle={true}
                            myCurrentObstacle={myCurrentObstacle}
                            cardToTransfer={myCurrentObstacle.current}
                            roomUsers={alivePlayers.current.filter(alivePlayer => !pyramidPlayers.includes(alivePlayer))}
                        />}

                        {selectTargetUser && <SelectTargetUser 
                            roomUsers={roomUsers}
                            cardToTransfer={cardToTransfer}
                            setCardToTransfer={setCardToTransfer} 
                            setSelectTargetUser={setSelectTargetUser}
                            setMyHand={setMyHand}
                            isTransferObstacle={false}
                        />}
                        {death ? <h1>VOCÊ MORREU!</h1> : <button className="deathButton" onClick={handleGameover}>Morri ou fui preso!</button>}

                        <MyCards
                            myHand={myHand} 
                            setMyHand={setMyHand}
                            setSelectTargetUser={setSelectTargetUser} 
                            setCardToTransfer={setCardToTransfer}
                            death={death}
                            myTurn={myTurn}
                            takenCard={takenCard}
                            actionsStack={actionsStack}
                            myCurrentObstacle={myCurrentObstacle}
                        />
                    </> 
                :
                    <>
                        {roomUsers.map((text) => {
                            return <li key={text}>{text} está na sala!</li>
                        })}
                        {startButton && <button onClick={handleStart}>Iniciar jogo</button>}
                    </>
                }
            </header>
        </div>
    );
}

export default Game;
