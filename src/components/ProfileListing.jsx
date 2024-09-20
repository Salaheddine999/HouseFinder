import { Link } from "react-router-dom";
import { FaBed, FaBath, FaParking, FaCouch } from "react-icons/fa";
import { BsPencilSquare } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";

export default function ProfileListing({ listing, id, onEdit, onDelete }) {
  return (
    <div className="bg-white overflow-hidden shadow-md rounded-lg transition duration-300 hover:shadow-xl border border-gray-200">
      <div className="relative pb-2/3">
        {/* {listing.imgUrls && listing.imgUrls.length > 0 ? (
          <img
            className="absolute h-full w-full object-cover"
            src={listing.imageUrls[0]}
            alt={listing.name}
            onError={(e) => {
              console.error("Image failed to load:", listing.imgUrls[0]);
              e.target.onerror = null;
              e.target.src =
                "https://via.placeholder.com/300x200?text=No+Image";
            }}
          />
        ) : (
          <div className="absolute h-full w-full bg-gray-200 flex items-center justify-center">
            <img
              src="https://via.placeholder.com/300x200?text=No+Image"
              alt="no image"
            />
          </div>
        )} */}
        <div className="absolute top-0 right-0 bg-white px-2 py-1 m-2 rounded-md text-xs font-semibold">
          {listing.type === "rent" ? "For Rent" : "For Sale"}
        </div>
      </div>
      <div className="p-4">
        <h4 className="text-lg font-semibold text-gray-900 mb-2">
          {listing.name}
        </h4>
        <p className="text-sm text-gray-600 mb-2">{listing.location}</p>
        <p className="text-lg font-bold text-primary mb-2">
          $
          {listing.offer
            ? listing.discountedPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            : listing.regularPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          {listing.type === "rent" && " / month"}
        </p>
        <div className="flex justify-between items-center text-xs text-gray-600">
          <span className="flex items-center">
            <FaBed className="mr-1" /> {listing.bedrooms}
          </span>
          <span className="flex items-center">
            <FaBath className="mr-1" /> {listing.bathrooms}
          </span>
          {listing.parking && (
            <span className="flex items-center">
              <FaParking className="mr-1" /> Parking
            </span>
          )}
          {listing.furnished && (
            <span className="flex items-center">
              <FaCouch className="mr-1" /> Furnished
            </span>
          )}
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-3 flex justify-between items-center border-t border-gray-200">
        <Link
          to={`/category/${listing.type}/${id}`}
          className="text-primary hover:text-primary-dark text-sm font-medium"
        >
          View Details
        </Link>
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <BsPencilSquare className="-ml-0.5 mr-1 h-4 w-4" /> Edit
          </button>
          <button
            onClick={onDelete}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <FaTrashAlt className="-ml-0.5 mr-1 h-4 w-4" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}
