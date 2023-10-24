import { getCard } from "../CardsMapping";

function CardTaken({takenCard, whoTookCard, setMysteriousPresent, mysteriousPresent, handleTakeCard, actionsStack}) {

    function handleMysteriousPresent() {
        if(actionsStack.length) {
            alert("Execute suas ações antes de pegar o presente misterioso!")
            return
        }
        setMysteriousPresent(false)
        handleTakeCard()
    }

    return (
        <>
            {takenCard !== null && takenCard !== "ACTION_CARD" && 
                <div>
                    <p>{whoTookCard} tirou a carta "{getCard(takenCard).name}"</p>
                    <p>Descrição: {getCard(takenCard).description}</p>
                    {mysteriousPresent && <button onClick={handleMysteriousPresent}>Presente misterioso</button>}
                </div>
            }
            {takenCard === "ACTION_CARD" && 
                <div>
                    <p>{whoTookCard} tirou uma carta de ação!"</p>
                </div>
            }
        </>
    )
}

export default CardTaken;