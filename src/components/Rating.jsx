import React from 'react'
import { GoPrimitiveDot } from "react-icons/go"
import { HiStar } from "react-icons/hi"
import {BsQuote} from "react-icons/bs"
export const Rating = ({ratings}) => {
  return (
    <div className='laptop:flex laptop:flex-row laptop:justify-around text-center justify-items-center laptop:text-left'>
        {ratings.map((rating) => (
            <div className='box-content laptop:w-5/12 laptop:flex laptop:flex-row laptop:py-5 laptop:pl-8 bg-white drop-shadow-md hover:drop-shadow-xl rounded-lg text-sm tablet:mx-14'>
                <div className='text-5xl ml-2 laptop:text-6xl laptop:mr-6 text-gray-300'>
                    <BsQuote/>
                </div>
                <div className='text-gray-500 font-medium mt-1 mb-6 tablet:my-5 mx-4 tablet:mx-14 laptop:mr-8 laptop:mx-0'>
                    <p className='mb-2'>{rating.description}</p>
                    <div className='laptop:flex laptop:flex-row items-center mb-1'>
                        <p className='text-dark font-semibold'>{rating.author}</p>
                        <p className='text-xs text-darker px-2 hidden laptop:block'><GoPrimitiveDot/></p>
                        <p className='text-gray-400'>{rating.position}</p>
                    </div>
                    <div className='flex flex-row text-primary text-lg justify-center laptop:justify-start pb-2'>
                        <HiStar/>
                        <HiStar/>
                        <HiStar/>
                        <HiStar/>
                        <HiStar/>
                    </div>
                </div>
            </div>
        ))}
    </div>
  )
}
