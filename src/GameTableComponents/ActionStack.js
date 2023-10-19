import { useContext } from "react";
import { getCard } from "../CardsMapping";
import { GameContext } from "../App";

function ActionStack({actionsStack, myTurn, theirTurn}){
    const {connection} = useContext(GameContext)

    function handleAction(){
        let card_action = actionsStack[actionsStack.length - 1]
        // Informa ao servidor que fez a ação da carta
        connection.current.send(JSON.stringify({protocol: "ACTION_DONE", card_id: card_action}))
    }

    return (
        <div>
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