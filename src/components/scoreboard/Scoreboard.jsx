import React from 'react'
import { useActions } from '../../hooks/actions';
import { useSelector } from 'react-redux';
import { ScoreList } from '../score-list/ScoreList';

export function Scoreboard() {
  const { items } = useSelector(state => state.localStorage);
  const { openModal } = useActions();
  const openPlayerStartForm = () => {
    openModal()
  }

  return (
    <div className='h-full flex items-center justify-center'>
      <div className='w-[500px] h-[500px] p-5 border flex flex-col justify-between items-center bg-sky-100'>
        <div className='mb-4 text-center'>
          <h1 className='font-bold text-2xl mb-2'>Hello there!</h1>
          <h2 className='font-bold text-xl'>Scoreboard</h2>
        </div>
        <ScoreList items={items} />
        <button className='py-2 px-4 bg-yellow-400 rounded hover:shadow-md transition-all capitalize' onClick={openPlayerStartForm}>Start game</button>
      </div>
    </div>
  )
}
