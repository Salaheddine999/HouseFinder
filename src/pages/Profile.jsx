import { getAuth, updateProfile } from "firebase/auth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  updateDoc,
  doc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { IoLogOutOutline, IoChevronForward } from "react-icons/io5";
import { BsFillHouseAddFill } from "react-icons/bs";
import ProfileListing from "../components/ProfileListing";

export default function Profile() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);

  const auth = getAuth();
  const [changeDetails, setChangeDetails] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = formData;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserListings = async () => {
      const listingsRef = collection(db, "listings");
      const q = query(
        listingsRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc"),
        limit(2)
      );
      const querySnap = await getDocs(q);

      const lastVisible = querySnap.docs[querySnap.docs.length - 1];
      setLastFetchedListing(lastVisible);

      const listings = [];

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
    };

    fetchUserListings();
  }, [auth.currentUser.uid]);

  const onLogout = () => {
    auth.signOut();
    navigate("/sign-in");
    window.location.reload();
  };

  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        // Update display name in firebase
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
      }

      // Update in firestore
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, {
        name,
      });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Could not update profile details");
    }
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onDelete = async (listingId) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      await deleteDoc(doc(db, "listings", listingId));
      const updatedListings = listings.filter(
        (listing) => listing.id !== listingId
      );
      setListings(updatedListings);
      toast.success("Listing deleted!");
    }
  };

  const onEdit = (listingId) => {
    navigate(`/edit-listing/${listingId}`);
  };

  // Pagination / Load More
  const onFetchMoreListings = async () => {
    try {
      // Get reference
      const listingsRef = collection(db, "listings");

      // Create a query
      const q = query(
        listingsRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc"),
        startAfter(lastFetchedListing),
        limit(2)
      );

      // Execute query
      const querySnap = await getDocs(q);

      const lastVisible = querySnap.docs[querySnap.docs.length - 1];
      setLastFetchedListing(lastVisible);

      const listings = [];

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListings((prevState) => [...prevState, ...listings]);
      setLoading(false);
    } catch (error) {
      toast.error("Could not fetch listings");
    }
  };

  return (
    <div className="profile mx-4 tablet:mx-0 flex justify-center items-start pt-12 pb-20">
      <div className="w-full max-w-4xl p-6 space-y-6 bg-white rounded-xl shadow-lg">
        {/* Header */}
        <header className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-darker">My Profile</h2>
          <button
            type="button"
            className="flex items-center px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 transition"
            onClick={onLogout}
          >
            <IoLogOutOutline className="w-5 h-5 mr-2" />
            Logout
          </button>
        </header>

        {/* User Details */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-medium">Personal Details</h3>
            <button
              type="button"
              className="text-primary font-semibold"
              onClick={() => {
                changeDetails && onSubmit();
                setChangeDetails((prev) => !prev);
              }}
            >
              {changeDetails ? "Done" : "Change"}
            </button>
          </div>
          <form className="space-y-3">
            <input
              type="text"
              id="name"
              disabled={!changeDetails}
              value={name}
              onChange={onChange}
              className={`w-full px-4 py-2 border rounded ${
                changeDetails ? "border-primary" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-primary`}
              placeholder="Your Name"
            />
            <input
              type="email"
              id="email"
              disabled={!changeDetails}
              value={email}
              onChange={onChange}
              className={`w-full px-4 py-2 border rounded ${
                changeDetails ? "border-primary" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-primary`}
              placeholder="you@example.com"
            />
          </form>
        </section>

        {/* Create Listing */}
        <Link
          to="/create-listing"
          className="flex items-center justify-center p-4 bg-primary text-white rounded-lg hover:bg-dark transition"
        >
          <BsFillHouseAddFill className="w-6 h-6 mr-2" />
          <span className="font-semibold">Sell or Rent Your Home</span>
          <IoChevronForward className="w-5 h-5 ml-2" />
        </Link>

        {/* User Listings */}
        {!loading && listings?.length > 0 && (
          <section className="space-y-4">
            <h3 className="text-2xl font-semibold">Your Listings</h3>
            <ul className="grid grid-cols-1 tablet:grid-cols-2 gap-4">
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
            {lastFetchedListing && (
              <p
                className="text-center text-primary cursor-pointer hover:underline"
                onClick={onFetchMoreListings}
              >
                Load More
              </p>
            )}
          </section>
        )}

        {/* No Listings Message */}
        {!loading && listings?.length === 0 && (
          <div className="text-center text-gray-500">
            <p>No listings found. Start by creating one!</p>
            <Link
              to="/create-listing"
              className="inline-flex items-center px-4 py-2 mt-2 text-white bg-primary rounded hover:bg-dark transition"
            >
              <BsFillHouseAddFill className="w-5 h-5 mr-2" />
              Create Listing
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
