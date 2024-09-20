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
import { BsFillHouseAddFill, BsPencilSquare } from "react-icons/bs";
import { FaTrashAlt, FaBed, FaBath, FaParking, FaCouch } from "react-icons/fa";
import Spinner from "../components/Spinner";
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
    fetchUserListings();
  }, [auth.currentUser.uid]);

  const fetchUserListings = async () => {
    const listingsRef = collection(db, "listings");
    const q = query(
      listingsRef,
      where("userRef", "==", auth.currentUser.uid),
      orderBy("timestamp", "desc"),
      limit(6)
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

  const onLogout = () => {
    auth.signOut();
    navigate("/sign-in");
  };

  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
      }

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
      toast.success("Listing deleted successfully!");
    }
  };

  const onEdit = (listingId) => navigate(`/edit-listing/${listingId}`);

  const onFetchMoreListings = async () => {
    try {
      const listingsRef = collection(db, "listings");
      const q = query(
        listingsRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc"),
        startAfter(lastFetchedListing),
        limit(6)
      );
      const querySnap = await getDocs(q);

      const lastVisible = querySnap.docs[querySnap.docs.length - 1];
      setLastFetchedListing(lastVisible);

      const newListings = [];

      querySnap.forEach((doc) => {
        return newListings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListings((prevState) => [...prevState, ...newListings]);
    } catch (error) {
      toast.error("Could not fetch more listings");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 tablet:px-6 laptop:px-8 py-12">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden mb-8">
          <div className="px-6 py-8 sm:px-8 bg-primary text-white">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold leading-7 sm:text-4xl sm:truncate">
                My Profile
              </h2>
              <button
                onClick={onLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
              >
                <IoLogOutOutline className="-ml-1 mr-2 h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
          <div className="px-6 py-8 sm:px-8">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Full name</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <input
                    type="text"
                    id="name"
                    disabled={!changeDetails}
                    value={name}
                    onChange={onChange}
                    className={`w-full px-3 py-2 border rounded-md text-sm ${
                      changeDetails ? "border-primary" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-primary`}
                  />
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">
                  Email address
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <input
                    type="email"
                    id="email"
                    disabled={true}
                    value={email}
                    className="w-full px-3 py-2 border rounded-md border-gray-300 bg-gray-100 text-sm"
                  />
                </dd>
              </div>
            </dl>
          </div>
          <div className="px-6 py-4 bg-gray-50 text-right sm:px-8">
            <button
              onClick={() => {
                changeDetails && onSubmit();
                setChangeDetails((prevState) => !prevState);
              }}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {changeDetails ? "Save Changes" : "Edit Profile"}
            </button>
          </div>
        </div>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="px-6 py-8 sm:px-8 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-900">My Listings</h3>
              <Link
                to="/create-listing"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <BsFillHouseAddFill className="-ml-1 mr-2 h-5 w-5" />
                Create New Listing
              </Link>
            </div>
          </div>

          {listings && listings.length > 0 ? (
            <div className="px-6 py-8 sm:px-8">
              <div className="grid grid-cols-1 gap-6 tablet:grid-cols-2 laptop:grid-cols-3">
                {listings.map((listing) => (
                  <ProfileListing
                    key={listing.id}
                    listing={listing.data}
                    id={listing.id}
                    onDelete={() => onDelete(listing.id)}
                    onEdit={() => onEdit(listing.id)}
                  />
                ))}
              </div>
              {lastFetchedListing && (
                <div className="mt-8 text-center">
                  <button
                    onClick={onFetchMoreListings}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Load More
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p className="text-center text-gray-500 text-sm py-8">
              No listings found. Create one to get started!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
