import { useState } from "react"

function SetUsername({user, conectar, setUserReady}) {
    const [localUser, setLocalUser] = useState(user.current)

    function handleType(event) {
        setLocalUser(event.target.value)
    }
    
    function click() {
        window.localStorage.username = localUser
        user.current = localUser
        setUserReady(true)
        conectar()
    }
    
    return (
        <div className="App-header">
            <div className="nickname-chooser">
                <p>Escolha um nome de usuário</p>
                <input value={localUser} onChange={handleType} type="text" />
                <button onClick={click}>PRONTO</button>
            </div>
        </div>
    );
}

export default SetUsername;
