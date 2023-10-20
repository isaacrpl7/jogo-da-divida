import { useContext } from "react"
import { GameContext } from "../App"

function SelectTargetUser({roomUsers, cardToTransfer, setCardToTransfer, setSelectTargetUser, setMyHand, isTransferObstacle}) {
    const {user, connection, myCards, myCurrentObstacle} = useContext(GameContext)

    function handleCardTransfer(target){
        const target_user = target
        
        if(isTransferObstacle) {
            myCurrentObstacle.current = null
            connection.current.send(JSON.stringify({protocol: "ACTION_DONE", target_user: target_user, obstacle: cardToTransfer, card_id: "PASS_OBSTACLE"}))
        } else {
            connection.current.send(JSON.stringify({protocol: "TRANSFER_CARD", target_user: target_user, card: cardToTransfer}))
    
            const cardToRemove = myCards.current.indexOf(cardToTransfer)
            myCards.current.splice(cardToRemove, 1)
    
            setMyHand([...myCards.current])
            setCardToTransfer(null)
            setSelectTargetUser(false)
        }
    }

    return (
        <div>
            <h2>Selecione o usuário para transferir</h2>
            {roomUsers.map((player) => {
                return player !== user.current && <li key={`${player}_transfer`}><button 
                onClick={() => {handleCardTransfer(player)}} 
                >{player}</button></li>
            })}
        </div>
    )
}

export default SelectTargetUser;