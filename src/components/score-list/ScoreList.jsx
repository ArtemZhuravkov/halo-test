import React, { useEffect, useState } from 'react'

export function ScoreList({ items }) {
    const [orderedScoreItems, setOrderedScoreItems] = useState([])
    useEffect(() => {
        const newArr = [...items].sort((a, b) => b.score - a.score)
        setOrderedScoreItems(newArr)

    }, [items])

    return (
        <div className='overflow-hidden w-full h-full p-3 mb-3'>
            <table className='flex-grow bg-sky-200 w-full h-full flex flex-col text-center'>
                <thead className='block'>
                    <tr className='table w-full'>
                        <th className='w-[200px] px-3 py-2'>Name</th>
                        <th className='w-[100px] px-3 py-2'>Difficulty</th>
                        <th className='w-[150px] px-3 py-2'>Total score</th>
                    </tr>
                </thead>
                <tbody className='overflow-y-auto overflow-x-hidden block flex-auto'>
                    {orderedScoreItems.length > 0 && (orderedScoreItems.map((item => (
                        <tr className='table w-full' key={item.name}>
                            <td className='w-[200px] px-3 py-2 overflow-hidden block overflow-x-auto'>{item.name}</td>
                            <td className='w-[100px] px-3 py-2'>{item.difficulty}</td>
                            <td className='w-[150px] px-3 py-2'>{item.score}</td>
                        </tr>
                    )))
                    )}
                </tbody>
            </table>
        </div>
    )
}
