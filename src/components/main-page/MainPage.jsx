import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Scoreboard } from '../scoreboard/Scoreboard'
import { PlayerForm } from '../player-form/PlayerForm';
import { useActions } from '../../hooks/actions';
import { Loader } from '../loader/Loader';
import { useGetTokenChunkQuery } from '../../store/api/cave-drone-server/cave-drone-server.api';
import { GameScreen } from '../game-screen/GameScreen';



export function MainPage() {
    const [skip, setSkip] = useState(true);
    const [playerId, setPlayerId] = useState("");
    const [isGameDataLoading, setIsGameDataLoading] = useState(false);
    const [isFetchingErrors, setIsFetchingErrors] = useState(false);

    const { isOpen } = useSelector(state => state.playerFormModal);
    const { isGameOver } = useSelector(state => state.gameIsOverState);
    const { setPlayerData, setIsGameOver } = useActions();

    const { data: firstChunk, error: firstChunkFetchErr } = useGetTokenChunkQuery({ id: playerId, idx: 1 }, { skip, refetchOnMountOrArgChange: true });
    const { data: secondChunk, error: secondChunkFetchErr } = useGetTokenChunkQuery({ id: playerId, idx: 2 }, { skip, refetchOnMountOrArgChange: true });
    const { data: thirdChunk, error: thirdChunkFetchErr } = useGetTokenChunkQuery({ id: playerId, idx: 3 }, { skip, refetchOnMountOrArgChange: true });
    const { data: fourthChunk, error: fourthChunkFetchErr } = useGetTokenChunkQuery({ id: playerId, idx: 4 }, { skip, refetchOnMountOrArgChange: true });

    useEffect(() => {
        if (playerId !== "") {
            setSkip(false);
            setIsGameDataLoading(true)
        }
    }, [playerId]);

    useEffect(() => {
        if (firstChunk && secondChunk && thirdChunk && fourthChunk) {
            const playerToken = `${firstChunk.chunk}${secondChunk.chunk}${thirdChunk.chunk}${fourthChunk.chunk}`;
            setPlayerData({ token: playerToken })
            setIsGameDataLoading(false);
            setIsGameOver(false);
        }
    }, [firstChunk, secondChunk, thirdChunk, fourthChunk]);

    useEffect(() => {
        if (firstChunkFetchErr || secondChunkFetchErr || thirdChunkFetchErr || fourthChunkFetchErr) {
            setIsFetchingErrors(true)
            setIsGameDataLoading(false);
        }
    }, [firstChunkFetchErr, secondChunkFetchErr, thirdChunkFetchErr, fourthChunkFetchErr]);

    const assignPlayerId = (playerId) => setPlayerId(playerId);

    const handleChunkFetchingErrors = () => {
        return (
            <div className='flex flex-col gap-3 items-center'>
                {isFetchingErrors && firstChunkFetchErr && <div>{firstChunkFetchErr.status} {JSON.stringify(firstChunkFetchErr.data)}</div>}
                {isFetchingErrors && secondChunkFetchErr && <div>{secondChunkFetchErr.status} {JSON.stringify(secondChunkFetchErr.data)}</div>}
                {isFetchingErrors && thirdChunkFetchErr && <div>{thirdChunkFetchErr.status} {JSON.stringify(thirdChunkFetchErr.data)}</div>}
                {isFetchingErrors && fourthChunkFetchErr && <div>{fourthChunkFetchErr.status} {JSON.stringify(fourthChunkFetchErr.data)}</div>}
                {isFetchingErrors && <button className='py-2 px-4 bg-yellow-400 rounded hover:shadow-md transition-all capitalize w-[150px]' onClick={() => {
                    setIsFetchingErrors(false)
                }
                }>Return to start</button>}
            </div>
        )
    }

    return (
        <div className='h-screen flex items-center justify-center'>
            {isGameOver && !isGameDataLoading && !isFetchingErrors && <Scoreboard />}
            {isGameDataLoading && (<Loader />)}
            {!isGameOver && !isGameDataLoading && <GameScreen />}
            {isOpen && (<PlayerForm assignPlayerId={assignPlayerId} />)}
            {handleChunkFetchingErrors()}
        </div>
    )
}
