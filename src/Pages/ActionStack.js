import { getCard } from "../CardsMapping";

function ActionStack({actionsStack, setActionsStack, actionStackRef, myTurn, theirTurn, connection}){

    function handleAction(){
        let card_action = actionsStack.pop()
        setActionsStack([...actionsStack])
        actionStackRef.current = [...actionsStack]
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