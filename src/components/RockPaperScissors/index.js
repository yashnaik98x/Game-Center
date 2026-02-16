import { Fragment, useState } from "react";

import "./styles.scss";

const choices = ["rock", "paper", "scissors"];

const RockPaperScissors = () => {
    const [playerChoice, setPlayerChoice] = useState(null);
    const [computerChoice, setComputerChoice] = useState(null);
    const [resultSet, setResultSet] = useState({ wins: 0, losses: 0 });
    const [shaking, setShaking] = useState(false);
    const [result, setResult] = useState(null);

    const handleChoice = (choice) => {
        setResult(null);
        setPlayerChoice('');
        setComputerChoice('');
        setShaking(true);
        setTimeout(() => {
            const computer = choices[Math.floor(Math.random() * 3)];
            setPlayerChoice(choice);
            setComputerChoice(computer);

            if (choice === computer) setResult("Tie");
            else if (
                (choice === "rock" && computer === "scissors") ||
                (choice === "paper" && computer === "rock") ||
                (choice === "scissors" && computer === "paper")
            ) {
                setResultSet({ ...resultSet, wins: resultSet.wins + 1 });
                setResult("You Win!");
            } else {
                setResultSet({ ...resultSet, losses: resultSet.losses + 1 });
                setResult("You Lose!");
            }
            setShaking(false);
        }, 3000);
    };

    return (
        <div className="rock-paper-scissors-container">
            <h1>Rock Paper Scissors</h1>
            <div className="rock-paper-scissors">
                <h3>Select your choice</h3>
                <div className="choices">
                    {choices.map((choice) => (
                        <button
                            key={choice}
                            className="choice"
                            onClick={() => handleChoice(choice)}
                        >
                            {choice[0].toUpperCase()}
                            {choice.substring(1)}
                        </button>
                    ))}
                </div>
                <div className="result-set">
                    <p>
                        Wins <span>{resultSet.wins}</span>
                    </p>
                    <p>
                        Losses <span>{resultSet.losses}</span>
                    </p>
                </div>
                {(shaking || (playerChoice && computerChoice)) && (
                    <div className="result">
                        <div className="result-images">
                            <div className={`result-image ${shaking && 'result-image-shaking'}`}>
                                {playerChoice && (
                                    <Fragment>
                                        <img src={`./${playerChoice}.png`} />
                                        <p>
                                            You chose{" "}
                                            <strong>{playerChoice}</strong>
                                        </p>
                                    </Fragment>
                                )}
                            </div>
                            <div className={`result-image ${shaking && 'result-image-shaking'}`}>
                                {computerChoice && (
                                    <Fragment>
                                        <img src={`./${computerChoice}.png`} />
                                        <p>
                                            CPU chose{" "}
                                            <strong>{computerChoice}</strong>
                                        </p>
                                    </Fragment>
                                )}
                            </div>
                        </div>
                        <h1>{result}</h1>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RockPaperScissors;