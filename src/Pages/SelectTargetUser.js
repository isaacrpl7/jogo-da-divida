function SelectTargetUser({user, roomUsers, cardToTransfer, connection, setCardToTransfer, setSelectTargetUser, myCards, setMyHand}) {

    function handleCardTransfer(target){
        const target_user = target
        
        connection.current.send(JSON.stringify({protocol: "TRANSFER_CARD", target_user: target_user, card: cardToTransfer}))

        const cardToRemove = myCards.current.indexOf(cardToTransfer)
        myCards.current.splice(cardToRemove, 1)

        setMyHand([...myCards.current])
        setCardToTransfer(null)
        setSelectTargetUser(false)
    }

    return (
        <div>
            <h2>Selecione o usuário para transferir</h2>
            {roomUsers.map((text) => {
                return text !== user.current && <li key={`${text}_transfer`}><button 
                onClick={() => {handleCardTransfer(text)}} 
                >{text}</button></li>
            })}
        </div>
    )
}

export default SelectTargetUser;