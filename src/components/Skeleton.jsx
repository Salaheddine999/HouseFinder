import React from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'


export default function index() {
  return (
    <div>
        <div className='relative box-content h-fit w-80 tablet:w-auto rounded-2xl border border-gray-300 bg-white z-10 mb-5 tablet:mx-3'>
            <Skeleton className='rounded-t-2xl h-56 w-screen' />

            <div className='px-3 py-5'>
                <Skeleton text-dark text-lg font-bold mb-3/>
                <Skeleton className='text-gray-800 text-xs font-medium' count={3}/>
            </div>
            <div className='px-3 py-3'>
                <Skeleton/>
            </div>
        </div>
    </div>
  )
}
