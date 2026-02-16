import { useLocation, Link, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import FlappyBird from "./components/FlappyBird";
import Puzzle from "./components/Puzzle";
import RockPaperScissors from "./components/RockPaperScissors";
import MNC from "./components/MNC";

function App() {
    const location = useLocation();

    return (
        <div className="App">
            {!['', '/', '///'].includes(location.pathname) && 
            <Link className='back' to='/'>
                <img src='./back.jpg' alt='Back'/>
            </Link>}
            <Routes>
                <Route path="/flappyBird" element={<FlappyBird />} />
                <Route
                    path="/rockPaperScissors"
                    element={<RockPaperScissors />}
                />
                <Route path="/mnc" element={<MNC />} />
                <Route path="/puzzle" element={<Puzzle />} />
                <Route path="/" element={<Home />} />
            </Routes>
        </div>
    );
}

export default App;
