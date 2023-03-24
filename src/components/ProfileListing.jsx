import React from 'react'
import { Link } from "react-router-dom"
import { ReactComponent as DeleteIcon } from "../assets/svg/deleteIcon.svg"
import { ReactComponent as EditIcon } from "../assets/svg/editIcon.svg"

export default function ProfileListing({listing, id, onDelete, onEdit, loading}) {
  return (
    <div>
        <div className='flex justify-end'>
            {onDelete && (
                    <DeleteIcon 
                    className="w-5 h-5 mx-2 cursor-pointer"
                    fill="rgb(231, 76, 60)" 
                    onClick={()=>onDelete(listing.id, listing.name)}
                    />
                )}

                {onEdit && 
                    <EditIcon className="w-5 h-5 cursor-pointer"
                    onClick={()=>onEdit(id)}
                    />
                } 
        </div>
        <Link to={`/category/${listing.type}/${id}`}>
                <article class="flex bg-white transition border-2 rounded-lg my-5 hover:shadow-lg">
                    <div class="hidden laptop:block laptop:basis-40">
                        <img
                        alt={ listing.name }
                        src={ listing.imageUrls[0] }
                        class="aspect-square h-full w-full object-cover rounded-l-lg"
                        />
                    </div>

                    <div class="flex flex-1 flex-col justify-between">
                        <div class="border-l border-gray-900/10 p-4 laptop:border-l-transparent laptop:p-6">
                            <p>
                                <h3 class="font-bold text-lg capitalized text-darker">
                                    {listing.name}
                                </h3>
                            </p>

                            <p class="mt-2 text-md font-medium leading-relaxed text-darker line-clamp-3">
                                $
                                {listing.offer 
                                ? listing.discountedPrice
                                    .toString()
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                : listing.regularPrice}
                                {listing.type ==='rent' && ' / Month'}
                            </p>
                            <p className='text-sm pt-2 text-darker normal-case'>
                                {listing.location}, {listing.City}, {listing.Country}
                            </p>
                        </div>
                        <div class="flex items-end justify-end">
                            <p class="block bg-primary px-5 py-3 text-center text-xs tablet:rounded-br-lg tablet:rounded-tl-lg font-bold uppercase text-white transition">
                                {listing.type}
                            </p>
                        </div>
                    </div>
                </article>
        </Link>
    </div>
    
  )
}
