import { getCard } from "../CardsMapping";

function CardTaken({takenCard, whoTookCard}) {
    return (
        <>
            {takenCard && 
                <div>
                    <p>{whoTookCard} tirou a carta "{getCard(takenCard).name}"</p>
                    <p>Descrição: {getCard(takenCard).description}</p>
                </div>
            }
        </>
    )
}

export default CardTaken;