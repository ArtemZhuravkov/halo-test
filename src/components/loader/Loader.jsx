import React from 'react'
import { RotatingLines } from 'react-loader-spinner'

export function Loader() {
  return (
    <div className='flex items-center p-5 border rounded'>
      <span className='font-bold text-lg mr-2'>Loading resources</span>
      <RotatingLines
        visible={true}
        height="40"
        width="40"
        strokeColor="grey"
        strokeWidth="5"
        animationDuration="0.75"
        ariaLabel="rotating-lines-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  )
}
