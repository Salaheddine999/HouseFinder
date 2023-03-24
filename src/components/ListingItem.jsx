import { Link } from "react-router-dom"
import { ReactComponent as DeleteIcon } from "../assets/svg/deleteIcon.svg"
import { ReactComponent as EditIcon } from "../assets/svg/editIcon.svg"
import {IoLocationOutline, IoBed} from "react-icons/io5"
import {SlSizeActual} from "react-icons/sl"
import {FaBath} from "react-icons/fa"


function ListingItem({listing, id, onDelete, onEdit, loading}){

    return(

        <>

        <Link to={`/category/${listing.type}/${id}`} className='property-list justify-evenly flex flex-row hover:drop-shadow-lg rounded-xl cursor-pointer'>
            <div className='relative box-content h-fit w-80 tablet:w-auto rounded-2xl border border-gray-300 bg-white z-10 mb-5' onClick={()=>{window.scrollTo({ top: 0, behavior: 'smooth' })}}>
                <div className='z-0 m-0 w-fit'>
                    <img className='rounded-t-2xl h-56 w-screen' src={ listing.imageUrls[0] } alt={ listing.name }/>
                </div>

                <div className='text-white bg-darker px-4 py-1 text-xs rounded absolute top-3 right-3 z-10 uppercase'>{listing.type}</div>
                {listing.offer &&
                    <div className='text-white bg-green-500 px-4 py-1 text-xs rounded absolute top-3 right-20 z-10 uppercase'>Offer</div>
                }
                

                <div className='px-3 py-5'>
                    {loading ? 'title' : <h1 className='text-dark text-lg font-bold mb-3'>{listing.name}</h1>}
                    <div className="flex">
                        <IoLocationOutline className="text-gray-800 text-lg mr-1"/><h2 className='text-gray-800 text-xs font-medium'>{listing.City}, {listing.Country}</h2>
                    </div>
                    
                </div>

                <div className='flex flex-row px-3 pb-5 border-gray-500 border-b justify-between text-gray-400'>
                    <div className='flex flex-col items-center justify-center text-lg font-medium'>
                        <IoBed className="text-dark"/>
                        <p className='pt-1 text-xs text-gray-800'>
                            {listing.bedrooms > 1 
                            ? `${listing.bedrooms} Bedrooms`
                            : '1 Bedroom' } 
                        </p>
                    </div>

                    <div className='flex flex-col items-center justify-center text-lg font-medium'>
                        <FaBath className="text-dark"/>
                        <p className='pt-1 text-xs text-gray-800'>
                        {listing.bathrooms > 1 
                            ? `${listing.bathrooms} Bathrooms`
                            : '1 Bathroom' } 
                        </p>
                    </div>

                    <div className='flex flex-col items-center justify-center text-lg font-medium'>
                        <SlSizeActual className="text-dark"/>
                        <p className='pt-1 text-xs text-gray-800'>{listing.size} m<sup>2</sup></p>
                    </div>
                </div>

                <div className='flex flex-row justify-between px-3 py-3 items-center'>
                    <div className='font-bold text-md text-gray-800'>
                        $
                        {listing.offer 
                        ? listing.discountedPrice
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        : listing.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        {listing.type ==='rent' && ' / Month'}
                    </div>
                    {listing.offer ? (<p className="text-sm line-through text-gray-500">${listing.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>) : (<p></p>)}
                </div>
            </div>
            {onDelete && (
                <DeleteIcon 
                className="removeIcon" 
                fill="rgb(231, 76, 60)" 
                onClick={()=>onDelete(listing.id, listing.name)}
                />
            )}

            {onEdit && 
            <EditIcon className="editIcon"
            onClick={()=>onEdit(id)}
            />
            }
        </Link>
        </>

    )

}

export default ListingItem