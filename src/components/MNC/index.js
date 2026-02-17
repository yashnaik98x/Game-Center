import { useEffect, useState } from 'react';
import './styles.scss';

const MNC = () => {
    const [leftCount, setLeftCount] = useState({missionaries: 0, cannibals: 0});
    const [rightCount, setRightCount] = useState({missionaries: 3, cannibals: 3});
    const [boatCount, setBoatCount] = useState({missionaries: 0, cannibals: 0});
    const [boatPosition, setBoatPosition] = useState('right');
    const [isGameOver, setIsGameOver] = useState(false);
    const [hasWon, setHasWon] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [timeTaken, setTimeTaken] = useState(null);

    const addToBoat = (characterType, characterPosition) => {
        if(characterPosition === boatPosition && boatCount.missionaries + boatCount.cannibals < 2) {
            if(characterPosition === 'left') {
                if(characterType === 'missionary') {
                    setLeftCount({...leftCount, missionaries: leftCount.missionaries - 1});
                    setBoatCount({...boatCount, missionaries: boatCount.missionaries + 1});
                }
                else {
                    setLeftCount({...leftCount, cannibals: leftCount.cannibals - 1});
                    setBoatCount({...boatCount, cannibals: boatCount.cannibals + 1});
                }
            } else if(characterPosition === 'right') {
                if(characterType === 'missionary') {
                    setRightCount({...rightCount, missionaries: rightCount.missionaries - 1});
                    setBoatCount({...boatCount, missionaries: boatCount.missionaries + 1});
                }
                else {
                    setRightCount({...rightCount, cannibals: rightCount.cannibals - 1});
                    setBoatCount({...boatCount, cannibals: boatCount.cannibals + 1});
                }
            }
        } 
        if(characterPosition === 'boat') {
            if(boatPosition === 'left') {
                if(characterType === 'missionary') {
                    setLeftCount({...leftCount, missionaries: leftCount.missionaries + 1});
                    setBoatCount({...boatCount, missionaries: boatCount.missionaries - 1});
                }
                else {
                    setLeftCount({...leftCount, cannibals: leftCount.cannibals + 1});
                    setBoatCount({...boatCount, cannibals: boatCount.cannibals - 1});
                }
            } else {
                if(characterType === 'missionary') {
                    setRightCount({...rightCount, missionaries: rightCount.missionaries + 1});
                    setBoatCount({...boatCount, missionaries: boatCount.missionaries - 1});
                }
                else {
                    setRightCount({...rightCount, cannibals: rightCount.cannibals + 1});
                    setBoatCount({...boatCount, cannibals: boatCount.cannibals - 1});
                }
            }
        }
    };

    const moveBoat = () => {
        if(boatCount.missionaries + boatCount.cannibals > 0) 
            setBoatPosition(boatPosition === 'left' ? 'right' : 'left');
    };

    const checkIfGameOver = () => {
        const leftMissionaryCount = leftCount.missionaries + (boatPosition === 'left' ? boatCount.missionaries : 0);
        const leftCannibalCount = leftCount.cannibals + (boatPosition === 'left' ? boatCount.cannibals : 0);
        const rightMissionaryCount = rightCount.missionaries + (boatPosition === 'right' ? boatCount.missionaries : 0);
        const rightCannibalCount = rightCount.cannibals + (boatPosition === 'right' ? boatCount.cannibals : 0);
        if(
            (leftMissionaryCount && leftMissionaryCount < leftCannibalCount) || 
            (rightMissionaryCount && rightMissionaryCount < rightCannibalCount)
        ) {
            setTimeTaken(seconds);
            setIsGameOver(true);
        }
        if(leftCount.missionaries === 3 && leftCount.cannibals === 3) {
            setHasWon(true);
            setTimeTaken(seconds);
            setIsGameOver(true);
        }
    };
    
    const getCharacterSet = (characterCount, characterType, characterPosition) => {
        return (
            <div className='character-set'>
                {Array(characterCount).fill(true).map((_, i) => {
                    return (
                        <div 
                            className={`character ${characterType}`} 
                            onClick={() => addToBoat(characterType, characterPosition)}
                        >
                            <img src={`./${characterType}.png`} alt='Character'/>
                        </div>
                    );
                })}
            </div>
        );
    };

    const playAgain = () => {
        setLeftCount({missionaries: 0, cannibals: 0});
        setRightCount({missionaries: 3, cannibals: 3});
        setBoatCount({missionaries: 0, cannibals: 0});
        setBoatPosition('right');
        setIsGameOver(false);
        setHasWon(false);
        setSeconds(0);
        setTimeTaken(0);
    };

    const formatTime = (_seconds) => {
        const minutes = Math.round(_seconds / 60);
        const roundedSeconds = _seconds % 60;
        return `${minutes < 10 ? "0" + minutes : minutes}:${
            roundedSeconds < 10 ? "0" + roundedSeconds : roundedSeconds
        }`;
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds((_seconds) => _seconds + 1);
        }, 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        setTimeout(() => {
            checkIfGameOver();
        }, 1000);
    }, [leftCount, boatCount, rightCount, boatPosition]);

    return (
        <div className="mnc-container">
            <h1>Missionaries & Cannibals</h1>
            <div className="mnc">
                <div className='terrain'>
                    <div className='land'>
                        <div className='character-set-container'>
                            {getCharacterSet(leftCount.missionaries, 'missionary', 'left')}
                            {getCharacterSet(leftCount.cannibals, 'cannibal', 'left')}
                        </div>
                    </div>
                    <div className='water'>
                        <div className={`boat ${boatPosition === 'left' ? 'boat-left' : 'boat-right'}`}>
                            <img src='./boat.png' alt='Boat' onClick={moveBoat}/>
                            <div className='character-set-container'>
                                {getCharacterSet(boatCount.missionaries, 'missionary', 'boat')}
                                {getCharacterSet(boatCount.cannibals, 'cannibal', 'boat')}
                            </div>
                        </div>
                    </div>
                    <div className='land'>
                        <div className='character-set-container'>
                            {getCharacterSet(rightCount.missionaries, 'missionary', 'right')}
                            {getCharacterSet(rightCount.cannibals, 'cannibal', 'right')}
                        </div>
                    </div>
                </div>
                {isGameOver && 
                <div className='game-over'>
                    <h2>Game Over</h2>
                    <h1>{hasWon ? 'You Won' : 'You Lost'}</h1>
                    {hasWon && <p>Time Taken <span>{formatTime(timeTaken)}</span></p>}
                    <button type='button' onClick={playAgain}>Play Again</button>
                </div>}
            </div>
            <div className="stats">
                <p>
                    Timer -{" "}
                    {isGameOver
                        ? formatTime(timeTaken)
                        : formatTime(seconds)}
                </p>
                <button onClick={playAgain}>Reset</button>
            </div>
        </div>
    );
};

export default MNC;