import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Cave } from '../cave/Cave'
import { useSelector } from 'react-redux';
import { GameResultModal } from '../game-result-modal/GameResultModal';
import { useActions } from '../../hooks/actions';
import * as settings from '../../helpers/settings';

export function GameScreen() {
    const gameData = useSelector(state => state.playerData);
    const { addResultToScoreboard } = useActions();
    const [caveData, setCaveData] = useState([]);
    const [isDataFetchingFinished, setIsDataFetchingFinished] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [gameResultTitle, setGameResultTitle] = useState("");
    const [gameTotalScore, setGameTotalScore] = useState(0);
    const [isConnected, setIsConnected] = useState(false);
    const websocket = useRef(null);

    const wallsHeight = useMemo(() => settings.caveWallInitialHeight - gameData.complexity, []);

    useEffect(() => {
        if (!isConnected && gameData.token) {
            websocket.current = new WebSocket('wss://cave-drone-server.shtoa.xyz/cave');

            websocket.current.onopen = () => {
                console.log('WebSocket connected!');
                const messageToSend = `player:${gameData.id}-${gameData.token}`;
                websocket.current.send(messageToSend);
                setIsConnected(true);
            }
            websocket.current.onmessage = (message) => {
                if (message.data !== "finished") {
                    const newPair = message.data.split(",");
                    setCaveData(prevData => [...prevData, newPair]);
                } else {
                    setIsDataFetchingFinished(true);
                }
            };
            websocket.current.onclose = () => {
                console.log('WebSocket disconnected!');
                setIsConnected(false);
            };

            websocket.current.onerror = (error) => {
                console.error('WebSocket error:', error);
                websocket.current.close();
            };
        }
        return () => {
            if (websocket.current) {
                websocket.current.onopen = null;
                websocket.current.onmessage = null;
                websocket.current.onclose = null;
                websocket.current.onerror = null;
                websocket.current.close();
            }
        }
    }, [gameData.token]);

    const lastSegment = useMemo(() => {
        if (isDataFetchingFinished) {
            const lastSegmentY = 0 - (caveData.length * wallsHeight);
            return lastSegmentY;
        }
    }, [isDataFetchingFinished])

    const handleGameOverScenario = useCallback((isGameOver, result, score) => {
        if (result === "win") {
            setGameResultTitle("Congratulations, you win!");
            setGameTotalScore(score);
            const data = {
                name: gameData.name,
                difficulty: gameData.complexity,
                score: score
            }
            addResultToScoreboard(data);
        } else {
            setGameResultTitle("Unfortunately, you lost!");
        }
        setGameOver(isGameOver);
    }, [gameOver])



    return (
        <div className='border-4 border-yellow-100 relative'>
            <Cave caveData={caveData}
                gameScreenHeight={settings.gameScreenHeight}
                lastSegment={lastSegment}
                setGameOver={handleGameOverScenario}
                gameOver={gameOver}
                wallsHeight={wallsHeight}
                complexity={gameData.complexity}
            />
            {gameOver && <GameResultModal isResultModalOpen={true} resultTitle={gameResultTitle} totalScore={gameTotalScore}/>}
        </div>
    )
}
