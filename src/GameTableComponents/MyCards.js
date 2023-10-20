import { useContext } from "react"
import { getCard, isActionCard } from "../CardsMapping"
import { GameContext } from "../App"

function MyCards({setSelectTargetUser, setCardToTransfer, myHand, setMyHand, death}) {

    const {connection, myCards, actionStackRef, myCurrentObstacle} = useContext(GameContext)

    function handleDiscard(card) {
        setSelectTargetUser(false)
        const cardIndex = myCards.current.indexOf(card)
        myCards.current.splice(cardIndex, 1)
        setMyHand([...myCards.current])
    }

    function handleUseCard(card_id) {
        setSelectTargetUser(false)
        if(card_id === 16 || card_id === 17) { // Se for carta de bloquear uma ação
            if(!actionStackRef.current.length) {
                alert('Você só pode jogar essa carta quando houver uma ação a bloquear!')
                return
            }
        }
        if(card_id === 18 || card_id === 19) { // Se for carta de repassar o obstáculo (O problema não é meu)
            if(actionStackRef.current.length) {
                alert('Todas as ações pendentes devem ser executadas antes de usar essa carta!')
                return
            }

            if(!myCurrentObstacle.current) {
                alert('Puxe um obstáculo para poder usar essa carta!')
                return
            }
        }
        if(card_id === 20 || card_id === 21){ // Se for carta de "Tô fora"
            if(myCurrentObstacle.current) {
                alert('Você só pode usar essa carta antes de puxar um obstáculo!')
                return
            }
        }

        connection.current.send(JSON.stringify({protocol: 'ACTION_STACK_ADD', card_id}))
        handleDiscard(card_id)
    }

    return (
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
    )
}

export default MyCards;