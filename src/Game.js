import { useContext, useState } from "react";
import SelectTargetUser from "./Pages/SelectTargetUser";
import ActionStack from "./GameTableComponents/ActionStack";
import CardTaken from "./GameTableComponents/CardTaken";
import MyCards from "./GameTableComponents/MyCards";
import { GameContext } from "./App";

function Game({startButton, gameBegun, roomUsers, myTurn, theirTurn, noNeedToDrawCard, setNoNeedToDrawCard, takenCard, whoTookCard, myHand, setMyHand, actionsStack, setMysteriousPresent, mysteriousPresent}) {

    const [selectTargetUser, setSelectTargetUser] = useState(false)
    const [cardToTransfer, setCardToTransfer] = useState(null)
    const [death, setDeath] = useState(false)
    const {room, connection, myCurrentObstacle} = useContext(GameContext)

    async function handleStart() {
        await fetch(`${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_API_ADDRESS}/turno/${room}`);
    }

    function handleNextTurn() {
        if (actionsStack.length){
            alert('Faça suas ações antes de passar seu turno!')
        } else {
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

                        {actionsStack.length !== 0 && <ActionStack 
                            actionsStack={actionsStack} 
                            roomUsers={roomUsers}
                            // setActionsStack={setActionsStack} 
                            // actionStackRef={actionStackRef} 
                            myTurn={myTurn} 
                            theirTurn={theirTurn}
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
