import { useContext } from "react"
import { getCard, isActionCard } from "../CardsMapping"
import { GameContext } from "../App"

function MyCards({setSelectTargetUser, setCardToTransfer, myHand, setMyHand, death, takenCard, actionsStack, myCurrentObstacle}) {

    const {connection} = useContext(GameContext)

    function handleDiscard(card) {
        setSelectTargetUser(false)
        
        connection.current.send(JSON.stringify({protocol: 'DISCARD_CARD', card: card}))
        setMyHand(prevState => {
            const cardIndex = prevState.indexOf(card)
            const new_array = [...prevState]
            new_array.splice(cardIndex, 1)
            return new_array
        })
    }

    function handleUseCard(card_id) {
        setSelectTargetUser(false)
        if(card_id === 16 || card_id === 17) { // Se for carta de bloquear uma ação
            if(!actionsStack.length) {
                alert('Você só pode jogar essa carta quando houver uma ação a bloquear!')
                return
            }
        }
        if(card_id === 18 || card_id === 19) { // Se for carta de repassar o obstáculo (O problema não é meu)
            if(actionsStack.length) {
                alert('Todas as ações pendentes devem ser executadas antes de usar essa carta!')
                return
            }

            if(myCurrentObstacle.current === null) {
                alert('Puxe um obstáculo para poder usar essa carta!')
                return
            }
        }
        if(card_id === 22) { // Se for carta de pular o turno e passar pro próximo ter 2 turnos (DOBRO E PASSO PRO PROX)
            if(takenCard !== null) {
                alert('Você só pode usar essa carta antes de puxar uma carta!')
                return
            }
        }
        if(card_id === 20 || card_id === 21){ // Se for carta de "Tô fora"
            if(takenCard !== null) {
                alert('Você só pode usar essa carta antes de puxar uma carta!')
                return
            }
        }

        connection.current.send(JSON.stringify({protocol: 'ACTION_STACK_ADD', card_id}))
        handleDiscard(card_id)
    }

    return (
        <div className="cards-section">
            <p>Suas cartas são:</p>
            <div className="cards-container">
                <div className="cards-scroll">
                    {myHand.map((card_id) => {
                        const card_obj = getCard(card_id)
                        const is_action = isActionCard(card_id)
                        return (
                            <div key={card_id} className="card">
                                <li className="card-list-item">
                                    <p style={{fontSize: '1.5rem', color: '#b4ffeb'}}>{card_obj.name}</p>
                                    <p style={{fontSize: '1rem'}}>{card_obj.description}</p>
                                    {!death &&
                                        <div className="cards-button-section">
                                            {is_action && <button onClick={() => {handleUseCard(card_id)}}>Usar carta</button>}
                                            <button 
                                                onClick={() => {
                                                    setSelectTargetUser(true)
                                                    setCardToTransfer(card_id)
                                                }}
                                            >Transferir carta</button>
                                            <button onClick={() => {handleDiscard(card_id)}}>Descartar carta</button>
                                        </div>
                                    }
                                </li>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default MyCards;