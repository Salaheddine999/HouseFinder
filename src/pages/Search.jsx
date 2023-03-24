import React from 'react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import ListingItem from '../components/ListingItem'
import Spinner from "../components/Spinner"
import {BsSearch} from "react-icons/bs"

export default function Search() {

    const [listings, setListings] = useState('')
  
    const {city, country, price, type} = useParams()

    const [loading, setLoading] = useState(true)
    //const [lastFetchedListing, setLastFetchedListing] = useState(null)
    const [city2, setCity2] = useState(city)
    const [country2, setCountry2] = useState(country)
    const [type2, setType2] = useState(type)
    const [price2, setPrice2] = useState(price)

    

    
    const fetchListings = async () => {
      try {
        // Get reference
        const listingsRef = collection(db, 'listings')

        // Create a query
        const q = query(
          listingsRef,
          where('City', '==' , city.toLocaleUpperCase()),
          where('Country', '==', country.toLocaleUpperCase()),
          where('regularPrice', '<=', price.toString()),
          where('type', '==', type)
          //orderBy('timestamp', 'desc'),
          //limit(8)
        )

        // Execute query
        const querySnap = await getDocs(q)

        // const lastVisible = querySnap.docs[querySnap.docs.length -1]
        // setLastFetchedListing(lastVisible)
        
        const listings = []

        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          })
        })

        setListings(listings)
        setLoading(false)

      } catch (error) {
        toast.error('Could not fetch listings')
      }
    }

    useEffect(()=>{
      fetchListings()
    },[])
    

    const fetchNewListings = async () => {
      try {
        // Get reference
        const listingsRef = collection(db, 'listings')

        // Create a query
        const q = query(
          listingsRef,
          where('City', '==' , city2.toLocaleUpperCase()),
          where('Country', '==', country2.toLocaleUpperCase()),
          where('regularPrice', '<=', price2.toString()),
          where('type', '==', type2)
        )

        // Execute query
        const querySnap = await getDocs(q)
        
        const listings = []

        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          })
        })

        setListings(listings)

      } catch (error) {
        toast.error('Could not fetch listings')
      }
    }

  return (
    <div>
        <h2 className='my-10 mx-8 font-semibold text-3xl'>Search for properties</h2>
        <div className='grid tablet:flex justify-center mb-8 gap-8'>
            <div className='tablet:place-self-end'>
              <p className='text-xl font-medium'>Filters:</p>
            </div>
          
            <div>
              <p className='text-lg font-medium pb-1'>City</p>
              <input
                type="text"
                value={city2}
                onChange={(e)=>setCity2(e.target.value)}
                id="City"
                placeholder="Marrakech"
                className="tablet:w-full rounded-md border-gray-100 shadow-sm tablet:text-sm bg-gray-50 "
              />              
            </div>

            <div>
              <p className='text-lg font-medium pb-1'>Country</p>
              <input
                type="text"
                value={country2}
                onChange={(e)=>setCountry2(e.target.value)}
                id="Morocoo"
                placeholder="Morocco"
                className="tablet:w-full rounded-md border-gray-100 shadow-sm tablet:text-sm bg-gray-50 "
              />   
            </div>

            <div>
              <p className='text-lg font-medium pb-1'>Max Price</p>
              <input
                type="number"
                value={price2}
                onChange={(e)=>setPrice2(e.target.value)}
                id="price"
                placeholder="$ 80,000"
                className="tablet:w-full rounded-md border-gray-100 shadow-sm tablet:text-sm bg-gray-50 "
              />   
            </div>

            <div>
              <p className='text-lg font-medium pb-1'>Type</p>
              <div className="flex w-full justify-center">
                  <div>
                    <select
                      value={type2}
                      onChange={(e)=>setType2(e.target.value)}                    
                      className="tablet:w-full rounded-md border-gray-100 shadow-sm tablet:text-sm bg-gray-50">
                      <option>Select Property Type</option>
                      <option value='rent'>Rent</option>
                      <option value='sale'>Sale</option>
                    </select>
                  </div>
              </div>  
            </div>

            <div className='self-end'>
              <button onClick={fetchNewListings}
              className='bg-primary text-white px-10 py-2 rounded-md text-lg font-medium'>
                <BsSearch className="h-6 w-6"/>
              </button>
            </div>
        </div>

        <div>
          
            {loading ? 
              <Spinner/>
            :
            (
                listings.length > 0 ? (
                  listings.map((listing) => (
                    <ul className='mx-8 py-2 inline tablet:grid tablet:grid-cols-4'>
                      <li className='tablet:col-span-1 mr-4'>
                          <ListingItem listing={listing.data} id={listing.id} key={listing.id}/>
                      </li>
                    </ul>
                  ))
                ):(
                  <div className='flex justify-center my-20'>
                    <p className='text-xl font-semibold'>
                      No results found, try to use more filters.
                    </p>
                  </div>
                )
            )}

            
        </div>
    </div>
  )
}
