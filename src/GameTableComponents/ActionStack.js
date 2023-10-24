import { useContext, useState } from "react";
import { getCard } from "../CardsMapping";
import { GameContext } from "../App";
import SelectTargetUser from "../Pages/SelectTargetUser";

function ActionStack({actionsStack, myTurn, theirTurn, roomUsers, myCurrentObstacle}){
    const {connection} = useContext(GameContext)
    const [selectTargetUser, setSelectTargetUser] = useState(false)
    const [cardToTransfer, setCardToTransfer] = useState(false)

    function handleAction(){
        let card_action = actionsStack[actionsStack.length - 1]

        let executeActionsBefore = false // Se for carta de "dobrar e passar pro próximo", as ações antes dela devem ser executadas primeiro
        if(card_action === 22) {
            if(actionsStack.length > 1){
                executeActionsBefore = true
                card_action = actionsStack[actionsStack.length - 2]
            }
        }
        if(card_action === 18 || card_action === 19) { // Se for carta de repassar o obstáculo (O problema não é meu)
            setSelectTargetUser(true);
            setCardToTransfer(myCurrentObstacle.current)
            return
        }
        // Informa ao servidor que fez a ação da carta
        connection.current.send(JSON.stringify({protocol: "ACTION_DONE", card_id: card_action, executeActionsBefore}))
    }

    return (
        <div>
            {selectTargetUser && <SelectTargetUser
                setSelectTargetUser={setSelectTargetUser}
                isTransferObstacle={true}
                myCurrentObstacle={myCurrentObstacle}
                cardToTransfer={cardToTransfer}
                roomUsers={roomUsers}
            />}
            {myTurn ? <h4>Sua pilha de ações</h4> : <h4>Pilha de ações de {theirTurn}</h4>}
            {actionsStack.map((card_id) => {
                const card = getCard(card_id)

                return (
                    <div key={card_id}>
                        <p style={{fontSize: '1.5rem'}}>{card.name}</p>
                        <p style={{fontSize: '1rem'}}>{card.description}</p>
                    </div>
                )
            })}
            {myTurn && <button onClick={handleAction}>Realizar ação da pilha</button>}
        </div>
    )
}

export default ActionStack;