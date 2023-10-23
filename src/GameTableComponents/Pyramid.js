import { useContext } from "react";
import { GameContext } from "../App";

function Pyramid({pyramidPlayers, setPyramidPlayers}) {
    const {user, pyramidPlayersRef, connection} = useContext(GameContext)

    function handleDissolve() {
        pyramidPlayersRef.current = []
        setPyramidPlayers(pyramidPlayersRef.current)
        connection.current.send(JSON.stringify({protocol: "PYRAMID_DISSOLVE"}))
    }

    return (
        <>
            {pyramidPlayers.length !== 0 && <div>
                <p>Pirâmide financeira</p>
                {pyramidPlayers.map((player, index) => {
                    return (
                        <>
                            <p>{player} {!index && "(Rei da pirâmide)"}</p>
                        </>
                    )
                })}
                {pyramidPlayers[0] === user.current && <button onClick={handleDissolve}>Dissolver a pirâmide.</button>}

            </div>}
        </>
    )
}

export default Pyramid;