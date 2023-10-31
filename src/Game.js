import { useContext, useEffect, useRef, useState } from "react";
import SelectTargetUser from "./Pages/SelectTargetUser";
import ActionStack from "./GameTableComponents/ActionStack";
import CardTaken from "./GameTableComponents/CardTaken";
import MyCards from "./GameTableComponents/MyCards";
import { GameContext } from "./App";
import Pyramid from "./GameTableComponents/Pyramid";
import { getCard, isBadObstacleCard, isBonusObstacleCard } from "./CardsMapping";
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
            setNoNeedToDrawCard(false)
            myCurrentObstacle.current = null
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
            setMysteriousPresent(false)
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
    
            if(message.protocol === 'USER_ENTERED' || message.protocol === "USER_LEFT") {
                alivePlayers.current = message.users
                setRoomUsers(message.users)
            }

            if(message.protocol === "GAMEOVER"){
                const indexOfDeadPlayer = alivePlayers.current.indexOf(message.player)
                alivePlayers.current.splice(indexOfDeadPlayer, 1)

                const indexOfDeadPlayerInPyramid = pyramidPlayers.indexOf(message.player)
                setPyramidPlayers(prevState => {
                    const new_array = [...prevState]
                    new_array.splice(indexOfDeadPlayerInPyramid, 1)
                    return new_array
                })
            }

            if(message.protocol === "WINNER"){
                if(message.winner === user.current) {
                    alert('Você ganhou o jogo. Parabéns!')
                } else {
                    alert(`${message.winner} ganhou o jogo! Podem ir dando os parabéns pra ele.`)
                }
            }

            if(message.protocol === "INITIAL_CARDS") {
                // myCards.current = message.cards
                setMyHand(message.cards)
                setGameBegun(true)
            }

            if(message.protocol === "YOUR_TURN") {
                setTakenCard(null)
                setWhoTookCard('')

                // myTurnRef.current = true
                setMyTurn(true)
                setTheirTurn('')
            }

            if(message.protocol === "THEIR_TURN") {
                setTakenCard(null)
                setWhoTookCard('')

                // myTurnRef.current = false
                setMyTurn(false)
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

                    // Se for carta de esquema de pirâmide, mas já tenho esquema de pirâmide
                    if(myCurrentObstacle.current >= 26 && myCurrentObstacle.current <= 30 && pyramidPlayers.includes(user.current)) {
                        setTransferPyramidVisible(true)
                    }
                } else {
                    // myCards.current = [...myCards.current, message.card]
                    setMyHand(prevState => [...prevState, message.card])
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
                    console.log(myTurn, "MY TURN")
                    if(myTurn) {
                        setNoNeedToDrawCard(true)
                        console.log("NO NEED TO DRAW CARD")
                    }
                }

                // actionStackRef.current = [...actionStackRef.current, message.card_id]
                setActionsStack(prevState => [...prevState, message.card_id])
            }

            if(message.protocol === "ACTION_STACK_REMOVE") {
                if (message.executeActionsBefore) {
                    setActionsStack(prevState => {
                        const new_array = [...prevState]
                        new_array.splice(prevState.length-2, 1)
                        return new_array
                    })
                } else {
                    setActionsStack(prevState => {
                        const new_array = [...prevState]
                        new_array.pop()
                        return new_array
                    })
                }
                // SE A CARTA "TÔ FORA ESTIVER PRESENTE NA PILHA, IMPEDIR DE PUXAR CARTA DO BOLO, SE NÃO, PODE PUXAR"
                if(actionsStack.includes(20) || actionsStack.includes(21)) {
                    if(myTurn) {
                        setNoNeedToDrawCard(true)
                    }
                } else {
                    if(myTurn) {
                        setNoNeedToDrawCard(false)
                    }
                }
            }

            if(message.protocol === "CARD_ACTION") {
                if(message.action === "BLOCK_ACTIONS"){ // Carta de bloquear outra ação foi executada
                    const blocked_card = actionsStack[actionsStack.length-1]
                    setActionsStack(prevState => {
                        const new_array = [...prevState]
                        new_array.pop()
                        return new_array
                    })

                    // SE A CARTA BLOQUEADA FOI A DE "TÔ FORA"
                    if(blocked_card === 20 || blocked_card === 21){
                        console.log('SETTING NO NEED TO DRAW CARD TO FALSE')
                        setNoNeedToDrawCard(false)
                    }
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

            if(message.protocol === "OBSTACLE_ACTION") {
                if(message.action === "CHANGE_PYRAMID") {
                    const newPyramid = message.pyramid
                    
                    if(!newPyramid.length){
                        alert("A pirâmide chegou no máximo de jogadores, portanto será dissolvida!")
                        // pyramidPlayersRef.current = []
                        setPyramidPlayers([])
                    } else {
                        setPyramidPlayers(message.pyramid)
                    }
                }
            }

            if(message.protocol === "PYRAMID_DISSOLVE"){
                // pyramidPlayersRef.current = []
                setPyramidPlayers([])
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
