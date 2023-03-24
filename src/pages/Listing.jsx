import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase.config";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import {IoLocationOutline, IoBed} from "react-icons/io5"
import {SlSizeFullscreen} from "react-icons/sl"
import {FaBath} from "react-icons/fa"
import {AiOutlineCheck, AiOutlineClose, AiOutlineShareAlt} from "react-icons/ai"
import { toast } from "react-toastify";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import Offers from "./Offers";
import Spinner from "../components/Spinner";

function Listing(){

    const [listing, setListing] = useState(null)
    const [loading, setLoading] = useState(true)
    const [shareLinkCopied, setShareLinkCopied] = useState(false)


    const navigate = useNavigate()
    const params = useParams()
    const auth = getAuth()


    useEffect(()=>{
        const fetchListing = async () =>{
            const docRef = doc(db, 'listings', params.listingId)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                setListing(docSnap.data());
                setLoading(false)
            }     
        }

        fetchListing()
    },[navigate, params.listingId])


    if(shareLinkCopied){
        toast.success('Link Copied!', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
    }
    return(
        
        <main>
            {loading ? 
                <Spinner />
            : (
                <>
                <section>
                    <div
                        className="mx-auto max-w-screen-xl px-4 py-8 tablet:py-12 tablet:px-6 desktop:py-12 desktop:px-8"
                    >
                        <div className="grid grid-cols-1 gap-8 desktop:grid-cols-2 desktop:gap-8">
                            <div
                                className="relative h-64 overflow-hidden rounded-lg tablet:h-80 desktop:order-last desktop:h-full"
                            >
                                <div className="h-fit tablet:h-2/4 pb-4">
                                    <Swiper
                                    breakpoints={{
                                        320: {     
                                        slidesPerView: 1,
                                        spaceBetween: 50,
                                            },
                                        720: {
                                        slidesPerView: 1,
                                        spaceBetween: 10,
                                            },
                                        1080: {
                                        slidesPerView: 2,
                                        spaceBetween: 10,
                                            },
                                        1400: {
                                        slidesPerView: 2,
                                        spaceBetween: 10,
                                            }
                                            }}   
                                    navigation={true}
                                    modules={[Navigation]}
                                    loop={true}
                                    className="mySwiper"
                                    >
                                    {listing.imageUrls.map((url, index)=>(
                                        <SwiperSlide key={index}>
                                            <img src={listing.imageUrls[index]} className="w-full h-full rounded-xl p-1"/>
                                        </SwiperSlide>
                                    ))}
                                    </Swiper>
                                </div>
                                
                                <MapContainer
                                    touchZoom={false}
                                    center={[listing.geolocation.lat, listing.geolocation.lng]}
                                    zoom={13}
                                    scrollWheelZoom={false}
                                    className="z-0 w-full h-2/4 rounded-lg"
                                >
                                    <TileLayer
                                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                    url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
                                    />

                                    <Marker
                                    position={[listing.geolocation.lat, listing.geolocation.lng]}
                                    >
                                    <Popup>{listing.location}</Popup>
                                    </Marker>
                                </MapContainer>
                            </div>

                            <div className="pt-4 desktop:pt-8 desktop:pb-8 border border-1 rounded-lg">
                                <div className="flex justify-between mx-6">
                                    <div className="flex">
                                        <div>
                                            <p className="text-white rounded p-1 text-sm bg-primary mr-1 ">
                                                For{listing.type === 'rent' ? ' Rent' : ' Sale'}
                                            </p>
                                        </div>
                                        {listing.offer && (
                                            <div>
                                                <p className="text-white rounded py-1 px-2 text-sm font-medium bg-green-500">
                                                    Offer
                                                </p>
                                            </div>
                                        )}

                                    </div>

                                        <button className="border border-solid rounded-full w-fit p-1 border-gray-300 hover:bg-gray-100" onClick={()=>
                                            {navigator.clipboard.writeText(window.location.href)
                                            setShareLinkCopied(true)
                                            setTimeout(()=>{setShareLinkCopied(false)},2000)
                                            }}>
                                            <AiOutlineShareAlt className="h-7 w-7 text-gray-500 "/>
                                        </button>
                                </div>

                                <div className="mx-6 py-6 space-y-2 border-b">
                                <h1 className="text-2xl tablet:text-3xl font-semibold mb-5">{listing.name} - ${listing.offer ? 
                                    listing.discountedPrice
                                        .toString()
                                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',') 
                                    
                                    : 

                                    (listing.regularPrice
                                    .toString()
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ','))}&nbsp;
                                    {listing.offer && <span className="text-[20px] line-through font-light text-gray-700">${                                   (listing.regularPrice
                                    .toString()
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ','))}</span>}
                                    
                                </h1>
                                <p className="flex font-medium"><IoLocationOutline className="h-5 w-5"/> {listing.location}, {listing.City}, {listing.Country}</p>
                                </div>
                                <div className="mx-6 py-6 space-y-2 border-b">
                                    <div className="tablet:grid tablet:grid-cols-3 gap-4 pt-4">
                                        <div className="flex pb-4 tablet:pb-0">
                                            <IoBed className="tablet:h-6 tablet:w-6 h-5 w-5"/>&nbsp;<p>{listing.bedrooms > 1 ? `${listing.bedrooms} Bedrooms` : '1 Bedroom'}</p>
                                        </div>
                                        <div className="flex pb-4 tablet:pb-0">
                                        <FaBath className="tablet:h-5 tablet:w-5 h-5 w-5"/>&nbsp;<p>{listing.bathrooms > 1 ? `${listing.bathrooms} Bathrooms` : '1 Bathroom'}</p>
                                        </div>
                                        <div className="flex pb-4 tablet:pb-0">
                                            <SlSizeFullscreen className="tablet:h-5 tablet:w-5 h-5 w-5"/>&nbsp;<p>{listing.size} m<sup>2</sup></p>
                                        </div>

                                        <div className="flex pb-4 tablet:pb-0">
                                        {listing.parking ? <AiOutlineCheck className="tablet:h-6 tablet:w-6 h-5 w-5"/> : <AiOutlineClose className="tablet:h-6 tablet:w-6"/>}&nbsp;<p>Parking Spot</p>
                                        </div>
                                        <div className="flex">
                                        {listing.furnished ? <AiOutlineCheck className="tablet:h-6 tablet:w-6 h-5 w-5"/> : <AiOutlineClose className="h-5 w-5 tablet:h-6 tablet:w-6"/>}&nbsp;<p>Furnished</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mx-6 py-6 space-y-2 border-b">
                                    <p className="font-semibold text-xl">Description</p>
                                    <p className="text-sm">{listing.description ? listing.description : 'no description'}</p>
                                </div>
                                <div className="mx-6 pb-4 space-y-2">
                                    {auth.currentUser?.uid !== listing.userRef && 
                                    <Link to={`/contact/${listing.userRef}?listingName=${listing.name}`} className="mt-8 inline-block rounded-md bg-primary px-12 py-3 text-sm font-medium text-white transition hover:bg-dark focus:outline-none focus:ring focus:ring-yellow-400">
                                        Contact Landlord
                                    </Link>}
                                </div>

                            </div>
                        </div>
                    </div>
                </section>

                <div className="mx-auto max-w-screen-xl mt-4 tablet:mt-20">
                    <h3 className="text-2xl font-semibold px-8">Recommended Listings</h3>
                    <hr className="mx-8 w-16 border-gray-400 border-[1px]"/>
                    <Offers/>
                </div>
                </>
            )}
            
        </main>
    )

}

export default Listing