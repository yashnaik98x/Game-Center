import { Fragment, useEffect, useRef, useState } from "react";
import "./styles.css";

const playerWidth = 100;
const playerHeight = 75;

const screenWidth = 1200;
const screenHeight = 600;
const gap = 185;

const charizardX = 100;

const getRandomNumber = (max) => {
    return Math.floor(Math.random() * max);
};

const FlappyBird = () => {
    const [charizardY, setCharizardY] = useState(
        (screenHeight / 2) - (playerHeight * 2)
    );
    const screenRef = useRef(null);
    const charizardRef = useRef(null);
    const [obstacles, setObstacles] = useState([]);
    const obstacleRefs = useRef([]);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [finalScore, setFinalScore] = useState(0);

    const createObstacle = () => {
        const height1 = getRandomNumber(screenHeight - gap);
        const height2 = screenHeight - gap - height1;
        const obstacle = [
            {x: screenWidth, y: 0, h: height1, w: 100},
            {x: screenWidth, y: screenHeight - height2, h: height2, w: 100}
        ];
        setObstacles(_obstacles => [..._obstacles, obstacle]);
    };

    const addObstacleRef = (i, element, position) => {
        if(!obstacleRefs.current[i]) 
            obstacleRefs.current[i] = [];
        obstacleRefs.current[i][position] = element;
    }

    const isGameOver = () => {
        if(charizardY <= -22 || charizardY >= 513) {
            setFinalScore(score);
            setGameOver(true);
        }
        for(let i = score - 1 < 0 ? 0 : score - 1; i < obstacleRefs.current.length; ++i) {
            if(obstacleRefs.current[i]?.length == 2) {
                for(let j = 0; j < 2; ++j) {
                    const element = obstacleRefs.current[i][j];
                    if(!element) 
                        break;
                    const x1 = element.offsetLeft;
                    const x2 = x1 + element.clientWidth;
                    const y1 = element.offsetTop;
                    const y2 = y1 + element.clientHeight;
                    if(charizardX >= x1 && charizardX <= x2 && charizardY >= y1 && charizardY <= y2) {
                        setFinalScore(score);
                        setGameOver(true);
                    }
                    if(charizardX + playerWidth >= x1 && charizardX + playerWidth <= x2 && charizardY + playerHeight >= y1 && charizardY + playerHeight <= y2) {
                        setFinalScore(score);
                        setGameOver(true);
                    }
                }
            }
        }
    };

    const updateScore = () => {
        for(let i = score; i < obstacleRefs.current.length; ++i) {
            if(obstacleRefs.current[i][0]?.offsetLeft <= 10 && !obstacleRefs.current[i][0].scoreMarked) {
                obstacleRefs.current[i][0].scoreMarked = true;
                obstacleRefs.current.shift();
                setScore(_score => _score + 1);
            }
        }
    };

    const handleClick = (event) => {
        if(event.code === 'Space') 
            setCharizardY(prev => prev - 50);
    };

    const playAgain = () => {
        setObstacles([]);
        setCharizardY((screenHeight / 2) - (playerHeight * 2));
        setScore(0);
        setFinalScore(0);
        setGameOver(false);
    };

    useEffect(() => {
        if(!gameOver) 
            isGameOver();
    }, [obstacles, charizardY]);
    
    useEffect(() => {
        if(!gameOver) 
            window.addEventListener('keydown', handleClick);
        return () => {
            window.removeEventListener('keydown', handleClick);
        };
    }, [gameOver]);

    useEffect(() => {
        let interval;
        if(!gameOver) {
            interval = setInterval(() => {
                setCharizardY(prev => prev + 6);
            }, 50);
        }
        return () => {
            clearInterval(interval);
        };
    }, [gameOver]);

    useEffect(() => {
        let interval;
        if(!gameOver) 
            interval = setInterval(createObstacle, 2500);
        return () => {
            clearInterval(interval);
        };
    }, [gameOver]);

    useEffect(() => {
        let interval;
        if(!gameOver)  
            interval = setInterval(updateScore, 1000);
        return () => {
            clearInterval(interval);
        };
    }, [gameOver]);

    useEffect(() => {
        let interval;
        if(!gameOver) {
            interval = setInterval(() => {
                setObstacles(_obstacles => {
                    for(let i = 0; i < _obstacles.length; ++i) {
                        _obstacles[i][0].x -= 1;
                        _obstacles[i][1].x -= 1;
                    }
                    return [..._obstacles];
                });
            }, 10);
        }
        return () => {
            clearInterval(interval);
        };
    }, [gameOver]);

    return (
        <div className="flappy-bird-container">
            <h1>Flappy Charizard</h1>
            <div className="screen" ref={screenRef} style={{width: `${screenWidth}px`, height: `${screenHeight}px`,}}>
                <div className='score'>
                    <p>{score}</p>
                </div>
                <div
                    className="player"
                    style={{
                        width: `${playerWidth}px`,
                        height: `${playerHeight}px`,
                        top: `${charizardY}px`,
                        left: `${charizardX}px`,
                    }}
                    ref={charizardRef}
                >
                    <img src="/charizard.gif" alt="Charizard" />
                </div>
                {obstacles.map((obstacle, i) => {
                    return (
                        <Fragment>
                            <img
                                src='/obstacle.png'
                                className='obstacle'
                                alt='Obstacle'
                                style={{
                                    top: obstacle[0].y,
                                    left: obstacle[0].x,
                                    height: obstacle[0].h,
                                    width: obstacle[0].w,
                                }}
                                ref={(element) => addObstacleRef(i, element, 0)}
                            />
                            <img
                                src='/obstacle.png'
                                className='obstacle'
                                alt='Obstacle'
                                style={{
                                    top: obstacle[1].y,
                                    left: obstacle[1].x,
                                    height: obstacle[1].h,
                                    width: obstacle[1].w,
                                    transform: 'rotate(180deg)'
                                }}
                                ref={(element) => addObstacleRef(i, element, 1)}
                            />
                        </Fragment>
                    );
                })}
                {gameOver && 
                <div className='game-over'>
                    <h2>Game Over</h2>
                    <h1>Score <span>{finalScore}</span></h1>
                    <button type='button' onClick={playAgain}>Play Again</button>
                </div>}
            </div>
            <div className="options"></div>
        </div>
    );
};

export default FlappyBird;