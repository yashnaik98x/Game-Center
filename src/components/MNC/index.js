import { useEffect, useState, useCallback } from 'react';
import './styles.scss';

const MNC = () => {
    const [leftCount, setLeftCount] = useState({ missionaries: 0, cannibals: 0 });
    const [rightCount, setRightCount] = useState({ missionaries: 3, cannibals: 3 });
    const [boatCount, setBoatCount] = useState({ missionaries: 0, cannibals: 0 });
    const [boatPosition, setBoatPosition] = useState('right');
    const [isGameOver, setIsGameOver] = useState(false);
    const [hasWon, setHasWon] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [timeTaken, setTimeTaken] = useState(null);

    // 🚤 LOAD / UNLOAD LOGIC
    const addToBoat = (type, position) => {
        if (isGameOver) return;

        // LOAD to boat
        if (position === boatPosition && boatCount.missionaries + boatCount.cannibals < 2) {
            if (position === 'left') {
                setLeftCount(prev => ({
                    ...prev,
                    [type + 's']: prev[type + 's'] - 1
                }));
            } else {
                setRightCount(prev => ({
                    ...prev,
                    [type + 's']: prev[type + 's'] - 1
                }));
            }

            setBoatCount(prev => ({
                ...prev,
                [type + 's']: prev[type + 's'] + 1
            }));
        }

        // UNLOAD from boat
        if (position === 'boat') {
            if (boatPosition === 'left') {
                setLeftCount(prev => ({
                    ...prev,
                    [type + 's']: prev[type + 's'] + 1
                }));
            } else {
                setRightCount(prev => ({
                    ...prev,
                    [type + 's']: prev[type + 's'] + 1
                }));
            }

            setBoatCount(prev => ({
                ...prev,
                [type + 's']: prev[type + 's'] - 1
            }));
        }
    };

    // 🚤 MOVE BOAT
    const moveBoat = () => {
        if (boatCount.missionaries + boatCount.cannibals === 0) return;

        setBoatPosition(prev => prev === 'left' ? 'right' : 'left');
    };

    // 🎯 GAME CHECK
    const checkGameState = useCallback(() => {
        const leftM = leftCount.missionaries + (boatPosition === 'left' ? boatCount.missionaries : 0);
        const leftC = leftCount.cannibals + (boatPosition === 'left' ? boatCount.cannibals : 0);
        const rightM = rightCount.missionaries + (boatPosition === 'right' ? boatCount.missionaries : 0);
        const rightC = rightCount.cannibals + (boatPosition === 'right' ? boatCount.cannibals : 0);

        if ((leftM > 0 && leftM < leftC) || (rightM > 0 && rightM < rightC)) {
            setHasWon(false);
            setIsGameOver(true);
            setTimeTaken(seconds);
        }

        if (leftCount.missionaries === 3 && leftCount.cannibals === 3) {
            setHasWon(true);
            setIsGameOver(true);
            setTimeTaken(seconds);
        }
    }, [leftCount, rightCount, boatCount, boatPosition, seconds]);

    useEffect(() => {
        checkGameState();
    }, [leftCount, rightCount, boatCount, boatPosition]);

    // ⏱ TIMER
    useEffect(() => {
        if (isGameOver) return;
        const interval = setInterval(() => setSeconds(s => s + 1), 1000);
        return () => clearInterval(interval);
    }, [isGameOver]);

    const playAgain = () => {
        setLeftCount({ missionaries: 0, cannibals: 0 });
        setRightCount({ missionaries: 3, cannibals: 3 });
        setBoatCount({ missionaries: 0, cannibals: 0 });
        setBoatPosition('right');
        setIsGameOver(false);
        setHasWon(false);
        setSeconds(0);
        setTimeTaken(null);
    };

    const formatTime = (_seconds) => {
        const minutes = Math.floor(_seconds / 60);
        const secs = _seconds % 60;
        return `${minutes < 10 ? "0" + minutes : minutes}:${secs < 10 ? "0" + secs : secs}`;
    };

    const getCharacterSet = (count, type, position) => (
        <div className="character-set">
            {Array(count).fill(true).map((_, i) => (
                <div
                    key={i}
                    className={`character ${type}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        addToBoat(type, position);
                    }}
                >
                    <img src={`./${type}.png`} alt={type} />
                </div>
            ))}
        </div>
    );

    return (
        <div className="mnc-container">
            <h1>Missionaries & Cannibals</h1>

            <div className="mnc">
                <div className="terrain">

                    <div className="land">
                        <div className="character-set-container">
                            {getCharacterSet(leftCount.missionaries, 'missionary', 'left')}
                            {getCharacterSet(leftCount.cannibals, 'cannibal', 'left')}
                        </div>
                    </div>

                    <div className="water">
                        <div
                            className={`boat ${boatPosition === 'left' ? 'boat-left' : 'boat-right'}`}
                            onClick={moveBoat}
                        >
                            <img src="./boat.png" alt="Boat" style={{ pointerEvents: 'none' }} />
                            <div className="character-set-container">
                                {getCharacterSet(boatCount.missionaries, 'missionary', 'boat')}
                                {getCharacterSet(boatCount.cannibals, 'cannibal', 'boat')}
                            </div>
                        </div>
                    </div>

                    <div className="land">
                        <div className="character-set-container">
                            {getCharacterSet(rightCount.missionaries, 'missionary', 'right')}
                            {getCharacterSet(rightCount.cannibals, 'cannibal', 'right')}
                        </div>
                    </div>

                </div>

                {isGameOver && (
                    <div className="game-over">
                        <h2>Game Over</h2>
                        <h1>{hasWon ? 'You Won! 🎉' : 'You Lost 😢'}</h1>
                        {hasWon && <p>Time Taken <span>{formatTime(timeTaken)}</span></p>}
                        <button onClick={playAgain}>Play Again</button>
                    </div>
                )}
            </div>

            <div className="stats">
                <p>Timer — {isGameOver ? formatTime(timeTaken) : formatTime(seconds)}</p>
                <button onClick={playAgain}>Reset</button>
            </div>
        </div>
    );
};

export default MNC;
