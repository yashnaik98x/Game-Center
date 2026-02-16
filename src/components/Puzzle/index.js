import { useState, useEffect } from "react";
import "./styles.css";
import _ from "lodash";

const puzzleSize = 600;
const movingDirections = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1]
];

const Puzzle = () => {
    const [puzzle, setPuzzle] = useState([]);
    const [puzzleImage, setPuzzleImage] = useState(
        "https://upload.wikimedia.org/wikipedia/en/b/bd/Doraemon_character.png"
    );
    const [puzzlePieceCount, setPuzzlePieceCount] = useState(3);
    const [puzzleImageInput, setPuzzleImageInput] = useState("");
    const [puzzlePieceCountInput, setPuzzlePieceCountInput] = useState("");
    const [isPuzzleFinished, setIsPuzzleFinished] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [timeTaken, setTimeTaken] = useState(null);

    const initializePuzzle = () => {
        let pieces = [];
        for (let i = 0; i < puzzlePieceCount; ++i) {
            for (let j = 0; j < puzzlePieceCount; ++j) {
                if (pieces.length === puzzlePieceCount * puzzlePieceCount - 1)
                    continue;
                pieces.push({
                    x: (puzzleSize / puzzlePieceCount) * i,
                    y: (puzzleSize / puzzlePieceCount) * j,
                    position: pieces.length + 1,
                });
            }
        }
        pieces = _.shuffle(pieces);
        const _puzzle = [];
        let k = 0;
        for (let i = 0; i < puzzlePieceCount; ++i) {
            _puzzle.push([]);
            for (let j = 0; j < puzzlePieceCount; ++j)
                _puzzle[i].push(pieces[k++]);
        }
        setPuzzle(_puzzle);
        setSeconds(0);
        setTimeTaken(null);
        setIsPuzzleFinished(false);
    };

    const movePuzzlePiece = (i, j) => {
        const _puzzle = puzzle;
        for (const dir of movingDirections) {
            if (
                i + dir[0] >= 0 &&
                i + dir[0] < puzzlePieceCount &&
                j + dir[1] >= 0 &&
                j + dir[1] < puzzlePieceCount
            ) {
                if (!_puzzle[i + dir[0]][j + dir[1]]) {
                    _puzzle[i + dir[0]][j + dir[1]] = _puzzle[i][j];
                    _puzzle[i][j] = null;
                    break;
                }
            }
        }
        setPuzzle(_.cloneDeep(_puzzle));
    };

    const checkIfPuzzleFinished = () => {
        console.log(puzzlePieceCount, puzzle.length);
        if (Number(puzzle.length) === Number(puzzlePieceCount)) {
            let lastPiece = 0;
            for (let i = 0; i < puzzlePieceCount; ++i) {
                for (let j = 0; j < puzzlePieceCount; ++j) {
                    console.log(puzzle[i][j]?.position, lastPiece + 1);
                    if (puzzle[i][j] && puzzle[i][j].position !== lastPiece + 1)
                        return console.log('Lost');
                    ++lastPiece;
                }
            }
            setTimeTaken(seconds);
            setIsPuzzleFinished(true);
        }
    };

    const updatePuzzleInput = () => {
        setPuzzleImage(puzzleImageInput || puzzleImage);
        setPuzzlePieceCount(puzzlePieceCountInput || puzzlePieceCount);
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
            if (!isPuzzleFinished) setSeconds((_seconds) => _seconds + 1);
        }, 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        checkIfPuzzleFinished();
    }, [puzzle]);

    useEffect(() => {
        initializePuzzle();
    }, [puzzleImageInput, puzzlePieceCount]);

    return (
        <div className="puzzle-container">
            <h1 className="heading">Face Puzzle</h1>
            <div
                className="puzzle"
                style={{ width: `${puzzleSize}px`, height: `${puzzleSize}px` }}
            >
                {puzzle.map((row, i) => {
                    return (
                        <div className="puzzle-row" key={i}>
                            {row.map((cell, j) => {
                                if (!cell)
                                    return (
                                        <div
                                            className="puzzle-cell"
                                            key={j}
                                            style={{
                                                height: `${
                                                    puzzleSize /
                                                    puzzlePieceCount
                                                }px`,
                                                width: `${
                                                    puzzleSize /
                                                    puzzlePieceCount
                                                }px`,
                                            }}
                                        ></div>
                                    );
                                return (
                                    <div
                                        className="puzzle-cell"
                                        key={j}
                                        onClick={() => movePuzzlePiece(i, j)}
                                        style={{
                                            height: `${
                                                puzzleSize / puzzlePieceCount
                                            }px`,
                                            width: `${
                                                puzzleSize / puzzlePieceCount
                                            }px`,
                                        }}
                                    >
                                        <div
                                            className="puzzle-piece"
                                            style={{
                                                backgroundImage: `url(${puzzleImage})`,
                                                backgroundSize: `${puzzleSize}px ${puzzleSize}px`,
                                                width: "100%",
                                                height: "100%",
                                                backgroundPosition: `-${cell.y}px -${cell.x}px`,
                                            }}
                                        ></div>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
                {isPuzzleFinished && (
                    <div className="puzzle-finished">
                        <h1>You Won!</h1>
                        <h3>Puzzle Finished</h3>
                        <p>
                            Time Taken <span>{formatTime(timeTaken)}</span>
                        </p>
                    </div>
                )}
            </div>
            <div className="stats" style={{ width: `${puzzleSize - 50}px` }}>
                <p>
                    Timer -{" "}
                    {isPuzzleFinished
                        ? formatTime(timeTaken)
                        : formatTime(seconds)}
                </p>
                <button onClick={initializePuzzle}>Reset</button>
            </div>
            <div className="edit-puzzle">
                <h3>Edit Puzzle</h3>
                <div className="edit-puzzle-input">
                    <label htmlFor="image">Image Link</label>
                    <input
                        type="text"
                        value={puzzleImageInput || puzzleImage}
                        onChange={(e) => setPuzzleImageInput(e.target.value)}
                    />
                </div>
                <div className="edit-puzzle-input">
                    <label htmlFor="image">Puzzle Piece Count</label>
                    <input
                        type="text"
                        value={puzzlePieceCountInput || puzzlePieceCount}
                        onChange={(e) =>
                            setPuzzlePieceCountInput(e.target.value)
                        }
                    />
                </div>
                <button type="button" onClick={updatePuzzleInput}>
                    Update
                </button>
            </div>
        </div>
    );
};

export default Puzzle;