import { Link } from "react-router-dom";

import './styles.scss';

const Home = () => {
    return (
        <div className='home'>
            <h1>Game Center</h1>	
            <div className='game-list'>
                <Link to='/puzzle'>
                    <div className='game'>
                        <h2>Face Puzzle</h2>
                    </div>
                </Link>
                <Link to='/rockPaperScissors'>
                    <div className='game'>
                        <h2>Rock Paper Scissors</h2>
                    </div>
                </Link>
                <Link to='/flappyBird'>
                    <div className='game'>
                        <h2>Flappy Charizard</h2>
                    </div>
                </Link>
                <Link to='/mnc'>
                    <div className='game'>
                        <h2>Missionaries & Cannibals</h2>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Home;