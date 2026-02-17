import { useState, useEffect, useRef, useCallback } from "react";
import "./styles.css";
import _ from "lodash";

const movingDirections = [[1, 0], [0, 1], [-1, 0], [0, -1]];

const Puzzle = () => {
    const containerRef = useRef(null);
    const [puzzleSize, setPuzzleSize] = useState(480);

    // Responsive puzzle size
    useEffect(() => {
        const updateSize = () => {
            if (containerRef.current) {
                const w = containerRef.current.clientWidth || window.innerWidth;
                setPuzzleSize(Math.min(480, w - 32));
            }
        };
        updateSize();
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, []);

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

    const initializePuzzle = useCallback(() => {
        let pieces = [];
        for (let i = 0; i < puzzlePieceCount; ++i) {
            for (let j = 0; j < puzzlePieceCount; ++j) {
                if (pieces.length === puzzlePieceCount * puzzlePieceCount - 1) continue;
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
    }, [puzzlePieceCount, puzzleSize]);

    const movePuzzlePiece = (i, j) => {
        const _puzzle = puzzle;
        for (const dir of movingDirections) {
            if (
                i + dir[0] >= 0 && i + dir[0] < puzzlePieceCount &&
                j + dir[1] >= 0 && j + dir[1] < puzzlePieceCount
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
        if (Number(puzzle.length) === Number(puzzlePieceCount)) {
            let lastPiece = 0;
            for (let i = 0; i < puzzlePieceCount; ++i) {
                for (let j = 0; j < puzzlePieceCount; ++j) {
                    if (puzzle[i][j] && puzzle[i][j].position !== lastPiece + 1) return;
                    ++lastPiece;
                }
            }
            setTimeTaken(seconds);
            setIsPuzzleFinished(true);
        }
    };

    const updatePuzzleInput = () => {
        if (puzzleImageInput) setPuzzleImage(puzzleImageInput);
        if (puzzlePieceCountInput) setPuzzlePieceCount(Number(puzzlePieceCountInput));
    };

    const formatTime = (_seconds) => {
        const minutes = Math.round(_seconds / 60);
        const roundedSeconds = _seconds % 60;
        return `${minutes < 10 ? "0" + minutes : minutes}:${roundedSeconds < 10 ? "0" + roundedSeconds : roundedSeconds}`;
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isPuzzleFinished) setSeconds((_s) => _s + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [isPuzzleFinished]);

    useEffect(() => { checkIfPuzzleFinished(); }, [puzzle]);
    useEffect(() => { initializePuzzle(); }, [puzzleImage, puzzlePieceCount, puzzleSize]);

    const cellSize = puzzleSize / puzzlePieceCount;

    return (
        <div className="puzzle-container" ref={containerRef}>
            <h1 className="heading">Face Puzzle</h1>
            <div className="puzzle" style={{ width: `${puzzleSize}px`, height: `${puzzleSize}px` }}>
                {puzzle.map((row, i) => (
                    <div className="puzzle-row" key={i}>
                        {row.map((cell, j) => {
                            if (!cell) return (
                                <div className="puzzle-cell empty" key={j}
                                    style={{ height: `${cellSize}px`, width: `${cellSize}px` }} />
                            );
                            return (
                                <div className="puzzle-cell" key={j}
                                    onClick={() => movePuzzlePiece(i, j)}
                                    style={{ height: `${cellSize}px`, width: `${cellSize}px` }}
                                >
                                    <div className="puzzle-piece" style={{
                                        backgroundImage: `url(${puzzleImage})`,
                                        backgroundSize: `${puzzleSize}px ${puzzleSize}px`,
                                        width: "100%", height: "100%",
                                        backgroundPosition: `-${cell.y}px -${cell.x}px`,
                                    }} />
                                </div>
                            );
                        })}
                    </div>
                ))}
                {isPuzzleFinished && (
                    <div className="puzzle-finished">
                        <h1>🎉 You Won!</h1>
                        <h3>Puzzle Finished</h3>
                        <p>Time Taken <span>{formatTime(timeTaken)}</span></p>
                    </div>
                )}
            </div>
            <div className="stats">
                <p>⏱ {isPuzzleFinished ? formatTime(timeTaken) : formatTime(seconds)}</p>
                <button onClick={initializePuzzle}>Reset</button>
            </div>
            <div className="edit-puzzle">
                <h3>Edit Puzzle</h3>
                <div className="edit-puzzle-input">
                    <label>Image URL</label>
                    <input type="text" value={puzzleImageInput || puzzleImage}
                        onChange={(e) => setPuzzleImageInput(e.target.value)} />
                </div>
                <div className="edit-puzzle-input">
                    <label>Grid Size</label>
                    <input type="number" min="2" max="6"
                        value={puzzlePieceCountInput || puzzlePieceCount}
                        onChange={(e) => setPuzzlePieceCountInput(e.target.value)} />
                </div>
                <button type="button" onClick={updatePuzzleInput}>Update</button>
            </div>
        </div>
    );
};

export default Puzzle;
