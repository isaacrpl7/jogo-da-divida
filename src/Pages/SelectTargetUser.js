import { useContext } from "react"
import { GameContext } from "../App"

function SelectTargetUser({roomUsers, cardToTransfer, setCardToTransfer, setSelectTargetUser, setMyHand, isTransferObstacle, myCurrentObstacle}) {
    const {user, connection} = useContext(GameContext)

    function handleCardTransfer(target){
        const target_user = target
        
        if(isTransferObstacle) {
            myCurrentObstacle.current = null
            connection.current.send(JSON.stringify({protocol: "ACTION_DONE", target_user: target_user, obstacle: cardToTransfer, card_id: "PASS_OBSTACLE"}))
            setSelectTargetUser(false)
        } else {
            connection.current.send(JSON.stringify({protocol: "TRANSFER_CARD", target_user: target_user, card: cardToTransfer}))
    
            setMyHand(prevState => {
                const cardToRemove = prevState.indexOf(cardToTransfer)
                const new_array = [...prevState]
                new_array.splice(cardToRemove, 1)
                return new_array
            })

            setCardToTransfer(null)
            setSelectTargetUser(false)
        }
    }

    return (
        <div className="select-user">
            <h2 style={{color: 'black'}}>Selecione o usuário para transferir</h2>
            {!isTransferObstacle && <p style={{position: 'absolute', top: '1rem', right: '1rem', margin: 0, color: 'black', cursor: 'pointer'}} onClick={() => {setSelectTargetUser(false)}}>X</p>}
            {roomUsers.map((player) => {
                return player !== user.current && <li key={`${player}_transfer`}><button 
                onClick={() => {handleCardTransfer(player)}} 
                style={{border: '1px solid black'}}
                >{player}</button></li>
            })}
        </div>
    )
}

export default SelectTargetUser;