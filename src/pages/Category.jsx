import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import ListingItem from "../components/ListingItem";
import Spinner from "../components/Spinner";
import { BsSearch } from "react-icons/bs";

function Category() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const params = useParams();

  useEffect(() => {
    fetchListings();
  }, [params.categoryName]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const listingsRef = collection(db, "listings");

      console.log("Fetching listings for category:", params.categoryName);
      console.log("Filters:", { city, country, maxPrice });

      let q = query(
        listingsRef,
        where("type", "==", params.categoryName),
        orderBy("timestamp", "desc"),
        limit(8)
      );

      if (city) {
        console.log("Adding City filter:", city.toUpperCase());
        q = query(q, where("City", "==", city.toUpperCase()));
      }
      if (country) {
        console.log("Adding Country filter:", country.toUpperCase());
        q = query(q, where("Country", "==", country.toUpperCase()));
      }

      console.log("Executing query...");
      const querySnap = await getDocs(q);
      console.log("Query snapshot size:", querySnap.size);

      if (querySnap.empty) {
        console.log("No documents found matching the query");
      } else {
        querySnap.forEach((doc) => {
          console.log("Document data:", doc.data());
        });
      }

      const lastVisible = querySnap.docs[querySnap.docs.length - 1];
      setLastFetchedListing(lastVisible);

      const listings = [];

      querySnap.forEach((doc) => {
        const data = doc.data();
        const listingPrice = data.offer
          ? data.discountedPrice
          : data.regularPrice;

        if (!maxPrice || listingPrice <= parseInt(maxPrice)) {
          listings.push({
            id: doc.id,
            data: data,
          });
        }
      });

      console.log("Filtered listings:", listings.length);
      setListings(listings);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching listings:", error);
      toast.error("Could not fetch listings");
      setLoading(false);
    }
  };

  const onFetchMoreListings = async () => {
    try {
      const listingsRef = collection(db, "listings");
      let q = query(
        listingsRef,
        where("type", "==", params.categoryName),
        orderBy("timestamp", "desc"),
        startAfter(lastFetchedListing),
        limit(4)
      );

      if (city) {
        q = query(q, where("City", "==", city.toUpperCase()));
      }
      if (country) {
        q = query(q, where("Country", "==", country.toUpperCase()));
      }

      const querySnap = await getDocs(q);

      const lastVisible = querySnap.docs[querySnap.docs.length - 1];
      setLastFetchedListing(lastVisible);

      const newListings = [];

      querySnap.forEach((doc) => {
        const data = doc.data();
        const listingPrice = data.offer
          ? data.discountedPrice
          : data.regularPrice;

        if (!maxPrice || listingPrice <= parseInt(maxPrice)) {
          newListings.push({
            id: doc.id,
            data: data,
          });
        }
      });

      setListings((prevListings) => [...prevListings, ...newListings]);
    } catch (error) {
      toast.error("Could not fetch more listings");
    }
  };

  const handleFilter = () => {
    fetchListings();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-semibold mb-8">
        {params.categoryName === "rent" ? "Places for Rent" : "Places for Sale"}
      </h2>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h3 className="text-xl font-medium mb-4">Filter</h3>
        <div className="grid grid-cols-1 tablet:grid-cols-4 gap-4">
          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              City
            </label>
            <input
              type="text"
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              placeholder="Enter city"
            />
          </div>
          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Country
            </label>
            <input
              type="text"
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              placeholder="Enter country"
            />
          </div>
          <div>
            <label
              htmlFor="maxPrice"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Max Price
            </label>
            <input
              type="number"
              id="maxPrice"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              placeholder="Enter max price"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleFilter}
              className="w-full bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-dark transition-colors duration-300 flex items-center justify-center"
            >
              <BsSearch className="mr-2" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <div className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <ListingItem
                listing={listing.data}
                id={listing.id}
                key={listing.id}
              />
            ))}
          </div>

          <div className="mt-8 text-center">
            {lastFetchedListing && (
              <button
                onClick={onFetchMoreListings}
                className="bg-primary text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-dark transition-colors duration-300"
              >
                Load More
              </button>
            )}
            {!lastFetchedListing && (
              <p className="text-sm text-gray-600">You have reached the end</p>
            )}
          </div>
        </>
      ) : (
        <p className="text-center text-lg text-gray-600">
          No listings found for {params.categoryName}
        </p>
      )}
    </div>
  );
}

export default Category;
