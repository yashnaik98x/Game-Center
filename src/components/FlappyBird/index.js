import { Fragment, useEffect, useState } from "react";
import "./styles.css";

const gap = 240;
const screenWidth = 1200;
const screenHeight = 600;

const getRandomNumber = (max) => {
  return Math.floor(Math.random() * max);
};

const FlappyBird = () => {

  const isMobile = window.innerWidth <= 768;

  const playerWidth = isMobile ? 60 : 100;
  const playerHeight = isMobile ? 45 : 75;

  const charizardX = isMobile ? 70 : 120;

  const [charizardY, setCharizardY] = useState(250);
  const [obstacles, setObstacles] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // ✅ Create Obstacle
  const createObstacle = () => {

    const spawnX = isMobile ? 700 : screenWidth;   // earlier spawn on mobile
    const pipeWidth = isMobile ? 60 : 100;         // smaller pipes on mobile

    const height1 = getRandomNumber(screenHeight - gap);
    const height2 = screenHeight - gap - height1;

    const obstacle = [
      { x: spawnX, y: 0, h: height1, w: pipeWidth, scored: false },
      { x: spawnX, y: screenHeight - height2, h: height2, w: pipeWidth }
    ];

    setObstacles(prev => [...prev, obstacle]);
  };

  // ✅ Collision
  const isGameOver = () => {
    const birdTop = charizardY;
    const birdBottom = charizardY + playerHeight;

    if (birdTop <= 0 || birdBottom >= screenHeight) {
      setFinalScore(score);
      setGameOver(true);
    }

    obstacles.forEach(obstacle => {
      const pipeX = obstacle[0].x;
      const pipeWidth = obstacle[0].w;

      if (
        charizardX + playerWidth > pipeX &&
        charizardX < pipeX + pipeWidth
      ) {
        if (
          birdTop < obstacle[0].h ||
          birdBottom > obstacle[1].y
        ) {
          setFinalScore(score);
          setGameOver(true);
        }
      }
    });
  };

  // ✅ Keyboard Jump (PC)
  const handleJump = (event) => {
    if (event.code === "Space") {
      setCharizardY(prev => prev - 70); // reduced jump power
    }
  };

  // ✅ Restart
  const playAgain = () => {
    setObstacles([]);
    setCharizardY(250);
    setScore(0);
    setFinalScore(0);
    setGameOver(false);
  };

  // Keyboard control
  useEffect(() => {
    if (!gameOver && !isMobile)
      window.addEventListener("keydown", handleJump);
    return () =>
      window.removeEventListener("keydown", handleJump);
  }, [gameOver]);

  // ✅ Mobile Tap Control
  useEffect(() => {
    if (!gameOver && isMobile) {
      const handleTouch = () => {
        setCharizardY(prev => prev - 70);
      };

      window.addEventListener("touchstart", handleTouch);
      return () =>
        window.removeEventListener("touchstart", handleTouch);
    }
  }, [gameOver]);

  // Gravity
  useEffect(() => {
    let interval;
    if (!gameOver) {
      interval = setInterval(() => {
        setCharizardY(prev => prev + 2);
      }, 20);
    }
    return () => clearInterval(interval);
  }, [gameOver]);

  // Spawn Pipes
  useEffect(() => {
    let interval;
    if (!gameOver)
      interval = setInterval(createObstacle, 2000); // slightly faster spawn
    return () => clearInterval(interval);
  }, [gameOver]);

  // Move Pipes
  useEffect(() => {
    let interval;

    if (!gameOver) {
      interval = setInterval(() => {
        setObstacles(prev =>
          prev.map(obstacle => [
            { ...obstacle[0], x: obstacle[0].x - 2 },
            { ...obstacle[1], x: obstacle[1].x - 2 }
          ])
        );
      }, 16);
    }

    return () => clearInterval(interval);
  }, [gameOver]);

  // Score
  useEffect(() => {
    if (gameOver) return;

    obstacles.forEach(obstacle => {
      if (
        obstacle[0].x + obstacle[0].w < charizardX &&
        !obstacle[0].scored
      ) {
        obstacle[0].scored = true;
        setScore(prev => prev + 1);
      }
    });

  }, [obstacles, gameOver]);

  // Collision check
  useEffect(() => {
    if (!gameOver)
      isGameOver();
  }, [obstacles, charizardY]);

  return (
    <div className="flappy-bird-container">
      <h1>Flappy Charizard</h1>

      <div
        className="screen"
        style={{
          width: isMobile ? "90vw" : "1200px",
          height: isMobile ? "70vh" : "600px"
        }}
      >

        {/* PC Instruction */}
        {!isMobile && !gameOver && (
          <div style={{
            position: "absolute",
            top: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            color: "white",
            fontSize: "18px",
            zIndex: 10
          }}>
            Press Space to Jump
          </div>
        )}

        <div className="score">{score}</div>

        <div
          className="player"
          style={{
            width: `${playerWidth}px`,
            height: `${playerHeight}px`,
            top: `${charizardY}px`,
            left: `${charizardX}px`
          }}
        >
          <img src="/charizard.gif" alt="Charizard" />
        </div>

        {obstacles.map((obstacle, i) => (
          <Fragment key={i}>
            <img
              src="/obstacle.png"
              className="obstacle"
              alt="Obstacle"
              style={{
                top: obstacle[0].y,
                left: obstacle[0].x,
                height: obstacle[0].h,
                width: obstacle[0].w
              }}
            />
            <img
              src="/obstacle.png"
              className="obstacle"
              alt="Obstacle"
              style={{
                top: obstacle[1].y,
                left: obstacle[1].x,
                height: obstacle[1].h,
                width: obstacle[1].w,
                transform: "rotate(180deg)"
              }}
            />
          </Fragment>
        ))}

        {gameOver && (
          <div className="game-over">
            <h2>Game Over</h2>
            <h1>
              Score <span>{finalScore}</span>
            </h1>
            <button onClick={playAgain}>Play Again</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlappyBird;
