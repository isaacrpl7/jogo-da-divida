
function InitialPage({criarSala}) {

    return (
        <div className="App">
            <header className="App-header">
                <button onClick={criarSala}>Criar sala</button>
            </header>
        </div>
    );
}

export default InitialPage;