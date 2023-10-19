import { useContext } from "react"
import { getCard, isActionCard } from "../CardsMapping"
import { GameContext } from "../App"

function MyCards({setSelectTargetUser, setCardToTransfer, myHand, setMyHand, death}) {

    const {connection, myCards} = useContext(GameContext)

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