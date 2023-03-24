import { useEffect, useState } from 'react'
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter
} from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import ListingItem from '../components/ListingItem'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import Skeleton from '../components/Skeleton'


function Offers(){

    const [listings, setListings] = useState(null)
    const [loading, setLoading] = useState(true)
    const [lastFetchedListing, setLastFetchedListing] = useState(null)
  
    useEffect(() => {
      const fetchListings = async () => {
        try {
          // Get reference
          const listingsRef = collection(db, 'listings')
  
          // Create a query
          const q = query(
            listingsRef,
            where('offer', '==', true),
            orderBy('timestamp', 'desc'),
            //limit(1)
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
  
          setListings(listings)
          setLoading(false)
          
        } catch (error) {
          toast.error('Could not fetch listings')
        }
      }
  
      fetchListings()
    }, [])
    
    const onFetchMoreListings = async () => {
      try {
        // Get reference
        const listingsRef = collection(db, 'listings')

        // Create a query
        const q = query(
          listingsRef,
          where('offer', '==', true),
          orderBy('timestamp', 'desc'),
          limit(1)
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
    

    return (
      <div className='category'>  
        {loading ? (
          <>
          <Swiper breakpoints={{
                      320: {     
                        slidesPerView: 1,
                        spaceBetween: 50,
                          },
                      720: {
                        slidesPerView: 3,
                        spaceBetween: 25,
                          },
                      1080: {
                        slidesPerView: 4,
                        spaceBetween: 20,
                          },
                      1400: {
                        slidesPerView: 4,
                        spaceBetween: 20,
                          }
                            }} 
              slidesPerView={4}
              className="mySwiper">
            <SwiperSlide>
                <Skeleton/>
            </SwiperSlide>
            <SwiperSlide>
                <Skeleton/>
            </SwiperSlide>
            <SwiperSlide>
                <Skeleton/>
            </SwiperSlide>
            <SwiperSlide>
                <Skeleton/>
            </SwiperSlide>
          </Swiper>
          </>
        ) : listings && listings.length > 0 ? (
          <>
            <main>
                  <Swiper
                    breakpoints={{
                      320: {     
                        slidesPerView: 1,
                        spaceBetween: 50,
                          },
                      720: {
                        slidesPerView: 3,
                        spaceBetween: 25,
                          },
                      1080: {
                        slidesPerView: 4,
                        spaceBetween: 20,
                          },
                      1400: {
                        slidesPerView: 4,
                        spaceBetween: 20,
                          }
                            }}
                  navigation={true}
                  modules={[Navigation]}
                  loop={true}
                  className="mySwiper"
                  >
                    {listings.map((listing) => (
                     <SwiperSlide>
                        <ListingItem listing={listing.data} id={listing.id} key={listing.id}/>
                     </SwiperSlide>
                    ))}
                  </Swiper>   
            </main>

            <br />
            <br />
            {/* {lastFetchedListing && (
              <p className='loadMore' onClick={onFetchMoreListings}>Load More</p>
            )} */}
          </>
        ) : (
          <p>There are no current offers</p>
        )}
      </div>
    )
  }

export default Offers