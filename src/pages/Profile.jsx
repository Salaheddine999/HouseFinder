import { getAuth, updateProfile } from "firebase/auth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updateDoc, doc, collection, getDocs, query, where, orderBy, deleteDoc, limit, startAfter } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import {IoLogOutOutline, IoChevronForward} from "react-icons/io5"
import {BsFillHouseAddFill} from "react-icons/bs"
import ProfileListing from "../components/ProfileListing";

function Profile(){

    const [listings, setListings] = useState(null)
    const [loading, setLoading] = useState(true)
    const [lastFetchedListing, setLastFetchedListing] = useState(null)

    const auth = getAuth()
    const [changeDetails, setChangeDetails] = useState(false)
    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email,
    })

    const {name, email} = formData

    const navigate = useNavigate()

    useEffect(()=>{
        const fetchUserListings = async () =>{
            const listingsRef = collection(db, 'listings')
            const q = query(listingsRef, where('userRef', '==', auth.currentUser.uid), orderBy('timestamp', 'desc'), limit(2))
            const querySnap = await getDocs(q)

            const lastVisible = querySnap.docs[querySnap.docs.length -1]
            setLastFetchedListing(lastVisible)
            
            const listings = []

            querySnap.forEach((doc)=>{
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                }) 
            })
            setListings(listings)
            setLoading(false)
        }

        fetchUserListings()
    },[auth.currentUser.uid])

    const onLogout = () =>{
        auth.signOut();
        navigate('/sign-in')
        window.location.reload();
        
    }

    const onSubmit = async () =>{

        try {
            if(auth.currentUser.displayName!== name){
                //Update display name in firebase
                await updateProfile(auth.currentUser, {
                    displayName: name
                })
            }

            //Update in firestore
            const userRef = doc(db, 'users', auth.currentUser.uid)
            await updateDoc(userRef,{
                name
            })
        } catch (error) {
            toast.error('Could not update profile details')
        }
    }
    
    const onChange = (e) =>{
        setFormData((prevState)=>({
            ...prevState,
            [e.target.id]: e.target.value,
        }))
    }

    
    const onDelete = async (listingId) => {
        if (window.confirm('Are you sure you want to delete this listing?')) {
          await deleteDoc(doc(db, 'listings', listingId))
          const updatedListings = listings.filter(
            (listing) => listing.id !== listingId
          )
          setListings(updatedListings)
          toast.success('listing deleted!')
        }
      }

    const onEdit = (listingId) =>{
        navigate(`/edit-listing/${listingId}`)
    }

    //Pagination / Load More
    const onFetchMoreListings = async () => {
        try {
        // Get reference
        const listingsRef = collection(db, 'listings')

        // Create a query
        const q = query(
            listingsRef,
            where('userRef', '==', auth.currentUser.uid),
            orderBy('timestamp', 'desc'),
            startAfter(lastFetchedListing),
            limit(2)
        )

        // Execute query
        const querySnap = await getDocs(q)

        const lastVisible = querySnap.docs[querySnap.docs.length -1]
        setLastFetchedListing(lastVisible)
        
        const listings = []

        querySnap.forEach((doc) => {
            return listings.push({
            id: doc.id,
            data: doc.data(),
            })
        })

        setListings((prevState) => [...prevState, ...listings])
        setLoading(false)
        
        } catch (error) {
        toast.error('Could not fetch listings')
        }
    }
    return(
        <div className="profile mx-20">
            <header className="profileHeader">
                <p className="pageHeader pb-10">My Profile</p>
                <div className="flex">
                    <button type="button" className="logOut bg-white text-darker font-semibold" onClick={onLogout}>
                        Logout
                    </button>
                    <IoLogOutOutline className="h-7 w-7 text-darker"/>
                </div>

            </header>
            <main>
                <div className="profileDetailsHeader">
                    <p className="text-lg">Personal Details</p>
                    <p className="changePersonalDetails text-primary" onClick={()=>{
                        changeDetails && onSubmit()
                        setChangeDetails((prevState) => !prevState)
                    }}>
                        {changeDetails ?'Done':'Change'}
                    </p>
                </div>
                <div className="profileCard mb-12">
                    <form>
                        <input type="text" 
                        id="name" 
                        className={!changeDetails ? 'profileName' : 'profileNameActive'}
                        disabled={!changeDetails}
                        value={name}
                        onChange={onChange}
                        />
                        <input type="text" 
                        id="email" 
                        className={!changeDetails ? 'profileEmail' : 'profileEmailActive'}
                        disabled={!changeDetails}
                        value={email}
                        onChange={onChange}
                        />
                    </form>
                </div>
                <Link to='/create-listing' className="createListing border-2 border-darker text-darker hover:bg-darker hover:text-white">
                    <BsFillHouseAddFill className="h-5 w-5" />
                    <p>Sell or rent your home</p>
                    <IoChevronForward className="h-5 w-5"/>
                </Link>

                {!loading && listings?.length > 0 && (
                    <>
                        <p className='listingText text-2xl pt-20'>Your Listings</p>
                        <hr className="w-16 border-gray-400 border-[1px]"/>
                        <ul className='flex flex-col max-w-lg pt-6'>
                        {listings.map((listing) => (
                            <ProfileListing
                                key={listing.id}
                                listing={listing.data}
                                id={listing.id}
                                onDelete={() => onDelete(listing.id)}
                                onEdit={() => onEdit(listing.id)}
                            />
                        ))}
                        </ul>
                        {lastFetchedListing ? (
                        <p className='loadMore' onClick={onFetchMoreListings}>Load More</p>
                        ):
                        (
                        <p className='text-sm text-center p-1 text-gray-600'>You have reached the end</p>
                        )
                        }
                    </>
                    )}
            </main>

        </div>
    );

}
export default Profile