import { useContext } from "react";
import { GameContext } from "../App";

function Pyramid({pyramidPlayers, setPyramidPlayers}) {
    const {user, connection} = useContext(GameContext)

    function handleDissolve() {
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