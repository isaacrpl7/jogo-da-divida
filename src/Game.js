import { useState } from "react";
import SelectTargetUser from "./Pages/SelectTargetUser";
import {getCard, isActionCard} from "./CardsMapping";
import ActionStack from "./Pages/ActionStack";

function Game({user, room, startButton, gameBegun, connection, roomUsers, roomPlayers, myTurn, theirTurn, takenCard, whoTookCard, myHand, myCards, setMyHand, actionsStack, setActionsStack, actionStackRef}) {

    const [selectTargetUser, setSelectTargetUser] = useState(false)
    const [cardToTransfer, setCardToTransfer] = useState(null)
    const [death, setDeath] = useState(false)

    async function handleStart() {
        await fetch(`${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_API_ADDRESS}/turno/${room}`);
    }

    function handleNextTurn() {
        connection.current.send(JSON.stringify({protocol: 'NEXT_TURN'}))
    }

    function handleTakeCard(){
        connection.current.send(JSON.stringify({protocol: 'TAKE_CARD'}))
    }

    function handleGameover(){
        connection.current.send(JSON.stringify({protocol: 'GAMEOVER'}))
        setDeath(true)
    }

    function handleDiscard(card) {
        const cardIndex = myCards.current.indexOf(card)
        myCards.current.splice(cardIndex, 1)
        setMyHand([...myCards.current])
    }

    function handleUseCard(card_id) {
        connection.current.send(JSON.stringify({protocol: 'ACTION_STACK_ADD', card_id}))
        handleDiscard(card_id)
    }

    return (
        <div className="App">
            <header className="App-header">

                { gameBegun ?
                    <>
                        {takenCard && 
                            <div>
                                <p>{whoTookCard} tirou a carta "{getCard(takenCard).name}"</p>
                                <p>Descrição: {getCard(takenCard).name}</p>
                            </div>
                        }
                        {myTurn ? 
                            <>
                                <p>O turno é seu!</p>
                                {takenCard ? <button onClick={handleNextTurn}>Proximo turno</button> : <button onClick={handleTakeCard}>Puxar carta</button>}
                            </>
                        :
                            <>
                                <p>O turno é de {theirTurn}</p>
                            </>
                        }

                        {actionsStack.length !== 0 && <ActionStack 
                            actionsStack={actionsStack} 
                            setActionsStack={setActionsStack} 
                            actionStackRef={actionStackRef} 
                            myTurn={myTurn} 
                            theirTurn={theirTurn} 
                            connection={connection}
                        />}

                        {selectTargetUser && <SelectTargetUser 
                            roomUsers={roomUsers}
                            user={user}
                            cardToTransfer={cardToTransfer} 
                            connection={connection} 
                            setCardToTransfer={setCardToTransfer} 
                            setSelectTargetUser={setSelectTargetUser}
                            myCards={myCards}
                            setMyHand={setMyHand}
                        />}
                        {death ? <h1>VOCÊ MORREU!</h1> : <button className="deathButton" onClick={handleGameover}>Morri ou fui preso!</button>}
                        <div style={{border: '1px solid white', width: '90%'}}>
                            <p>Suas cartas são:</p>
                            {myHand.map((card_id) => {
                                const card_obj = getCard(card_id)
                                const is_action = isActionCard(card_id)
                                return (
                                    <li key={card_id}>
                                        <p style={{fontSize: '1.5rem'}}>{card_obj.name}</p>
                                        <p style={{fontSize: '1rem'}}>{card_obj.description}</p>
                                        {!death &&
                                            <>
                                                <button 
                                                    onClick={() => {
                                                        setSelectTargetUser(true)
                                                        setCardToTransfer(card_id)
                                                    }}
                                                >Transferir carta</button>
                                                <button onClick={() => {handleDiscard(card_id)}}>Descartar carta</button>
                                                {is_action && <button onClick={() => {handleUseCard(card_id)}}>Usar carta</button>}
                                            </>
                                        }
                                    </li>
                                )
                            })}
                        </div>
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
