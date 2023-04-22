import React, { useEffect, useState } from "react";

function* generateId() {
    let id = 1;
    while (true) {
        yield id++;
    }
}
const getId = generateId();

const InitialInputState = {
    a: 0,
    b: 0,
};
const App = () => {
    const [inputState, setInputState] = useState({ ...InitialInputState });
    const [result, setResult] = useState(0);
    const [histories, setHistories] = useState([]);
    const [restoredHistory, setRestoredHistory] = useState(null);

    const handleInputFields = (e) => {
        setInputState({
            ...inputState,
            [e.target.name]: parseInt(e.target.value),
        });
    };

    const handleClearOps = () => {
        setInputState({
            ...InitialInputState,
        });
        setResult(0);
    };

    const handleArithmeticOps = (operation) => {
        if (!inputState.a || !inputState.b) {
            alert("invalid input");
            return;
        }

        const f = new Function(
            "operation",
            `
                  return ${inputState.a} ${operation} ${inputState.b}
               
            `
        );
        const result = f(operation);
        setResult(result);

        if (!restoredHistory) {
            generateHistory(operation, result);
        }
    };

    const generateHistory = (operation, result) => {
        const historyItem = {
            id: getId.next().value,
            inputs: inputState,
            operation,
            result,
            date: new Date(),
        };
        setHistories([historyItem, ...histories]);
    };

    const handleRestoreBtn = (historyItem) => {
        setInputState({ ...historyItem.inputs });
        setResult(historyItem.result);
        // setRestoredStory(historyItem);
    };

    return (
        <div style={{ width: "50%", margin: "0 auto" }}>
            <h2> Result: {result} </h2>

            <div>
                <h3>Inputs: </h3>
                <input
                    type="number"
                    value={inputState.a}
                    onChange={handleInputFields}
                    name="a"
                />
                <input
                    type="number"
                    value={inputState.b}
                    onChange={handleInputFields}
                    name="b"
                />
            </div>
            <div>
                <h3>Operations: </h3>
                <button onClick={() => handleArithmeticOps("+")}>
                    addition
                </button>
                <button onClick={() => handleArithmeticOps("-")}>
                    subtraction
                </button>
                <button onClick={() => handleArithmeticOps("*")}>
                    multiplication
                </button>
                <button onClick={() => handleArithmeticOps("/")}>
                    division
                </button>
                <button onClick={handleClearOps}>Reset</button>
            </div>
            <div>
                <h3> History: </h3>
                {histories.length === 0 ? (
                    <p>There is no history</p>
                ) : (
                    <ul>
                        {histories.map((historyItem) => (
                            <li key={historyItem.id}>
                                <p>
                                    Operation: {historyItem.inputs.a}
                                    {historyItem.operation}
                                    {historyItem.inputs.b}, Result:
                                    {historyItem.result}
                                </p>
                                <small>
                                    {historyItem.date.toLocaleDateString()}
                                    {"   "}
                                    {historyItem.date.toLocaleTimeString()}
                                </small>
                                <br />
                                <button
                                    onClick={() =>
                                        handleRestoreBtn(historyItem)
                                    }
                                    disabled={
                                        restoredHistory !== null &&
                                        restoredHistory.id === historyItem.id
                                    }
                                >
                                    Restore
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default App;
