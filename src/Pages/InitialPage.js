import { useNavigate } from "react-router-dom";

function InitialPage({user, connection}) {
    const navigate = useNavigate()

    async function criarSala() {
        const response = await fetch(`${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_API_ADDRESS}/criarSala`,
        {method: 'POST', headers: {
            "Content-Type": "application/json",
        }, body: JSON.stringify({user: user.current})});
        const room = await response.json()
        if(room.msg) {
            console.log(room.msg)
        }
        connection.current.send(JSON.stringify({protocol: 'ENTER_ROOM', room: room.id}))
        navigate(`/${room.id}`)
    }

    return (
        <div className="App">
            <header className="App-header">
                <button onClick={criarSala}>Criar sala</button>
            </header>
        </div>
    );
}

export default InitialPage;