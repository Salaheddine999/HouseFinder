import { useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { db } from "../firebase.config";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import {
  BsArrowLeft,
  BsHouseDoor,
  BsGeoAlt,
  BsCurrencyDollar,
  BsImages,
} from "react-icons/bs";
import { Link } from "react-router-dom";

function CreateListing() {
  const [loading, setLoading] = useState(false);
  const [geolocationEnabled, setGeolocationEnabled] = useState(true);
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    size: 0,
    address: "",
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    images: {},
    latitude: 0,
    longitude: 0,
    description: "",
    City: "",
    Country: "",
  });

  const {
    type,
    name,
    bedrooms,
    bathrooms,
    description,
    parking,
    furnished,
    size,
    address,
    City,
    Country,
    offer,
    regularPrice,
    discountedPrice,
    images,
    latitude,
    longitude,
  } = formData;

  const auth = getAuth();
  const navigate = useNavigate();
  const isMounted = useRef(true);
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({ ...formData, userRef: user.uid });
        } else {
          navigate("/sign-in");
        }
      });
    }

    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  const onMutate = (e) => {
    let boolean = null;

    if (e.target.value === "true") {
      boolean = true;
    }

    if (e.target.value === "false") {
      boolean = false;
    }

    // Files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }

    // Text/Booleans/Numbers
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (discountedPrice >= regularPrice) {
      setLoading(false);
      toast.error("Discounted price needs to be less than regular price");
      return;
    }

    if (images.length > 6) {
      setLoading(false);
      toast.error("Max 6 images");
      return;
    }

    let geolocation = {};
    let location;

    if (geolocationEnabled) {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`
      );
      const data = await response.json();

      geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
      geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;

      location =
        data.status === "ZERO_RESULTS"
          ? undefined
          : data.results[0]?.formatted_address;

      if (location === undefined || location.includes("undefined")) {
        setLoading(false);
        toast.error("Please enter a correct address");
        return;
      }
    } else {
      geolocation.lat = latitude;
      geolocation.lng = longitude;
    }

    // Store image in firebase
    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;

        const storageRef = ref(storage, "images/" + fileName);

        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                break;
              case "running":
                break;
              default:
                break;
            }
          },
          (error) => {
            reject(error);
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };

    const imageUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch(() => {
      setLoading(false);
      toast.error("Images not uploaded");
      return;
    });

    const formDataCopy = {
      ...formData,
      imageUrls,
      geolocation,
      timestamp: serverTimestamp(),
    };

    formDataCopy.location = address;
    delete formDataCopy.images;
    delete formDataCopy.address;
    !formDataCopy.offer && delete formDataCopy.discountedPrice;

    const docRef = await addDoc(collection(db, "listings"), formDataCopy);
    setLoading(false);
    toast.success("Listing saved");
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <Link
          to="/profile"
          className="inline-flex items-center mb-6 text-black hover:text-primary transition duration-300"
        >
          <BsArrowLeft className="h-5 w-5 mr-2" />
          <span className="font-medium">Back to Profile</span>
        </Link>

        <h1 className="text-4xl font-bold mb-8 text-gray-800">
          Create a Listing
        </h1>

        <div className="mb-8">
          <ProgressBar currentStep={step} totalSteps={totalSteps} />
        </div>

        <form onSubmit={onSubmit} className="space-y-8">
          {step === 1 && (
            <Section icon={<BsHouseDoor />} title="Basic Information">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FormField label="Listing Type" id="type">
                  <div className="flex space-x-4">
                    <ToggleButton
                      active={type === "sale"}
                      onClick={() =>
                        onMutate({ target: { id: "type", value: "sale" } })
                      }
                    >
                      Sell
                    </ToggleButton>
                    <ToggleButton
                      active={type === "rent"}
                      onClick={() =>
                        onMutate({ target: { id: "type", value: "rent" } })
                      }
                    >
                      Rent
                    </ToggleButton>
                  </div>
                </FormField>
                <FormField label="Property Name" id="name">
                  <input
                    className="form-input w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                    type="text"
                    id="name"
                    value={name}
                    onChange={onMutate}
                    maxLength="32"
                    minLength="10"
                    required
                  />
                </FormField>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                <FormField label="Bedrooms" id="bedrooms">
                  <input
                    className="form-input w-full"
                    type="number"
                    id="bedrooms"
                    value={bedrooms}
                    onChange={onMutate}
                    min="1"
                    max="50"
                    required
                  />
                </FormField>
                <FormField label="Bathrooms" id="bathrooms">
                  <input
                    className="form-input w-full"
                    type="number"
                    id="bathrooms"
                    value={bathrooms}
                    onChange={onMutate}
                    min="1"
                    max="50"
                    required
                  />
                </FormField>
                <FormField label="Size (sqft)" id="size">
                  <input
                    className="form-input w-full"
                    type="number"
                    id="size"
                    value={size}
                    onChange={onMutate}
                    required
                  />
                </FormField>
                <FormField label="Parking" id="parking">
                  <ToggleButtonGroup
                    options={[
                      { label: "Yes", value: true },
                      { label: "No", value: false },
                    ]}
                    value={parking}
                    onChange={(value) =>
                      onMutate({ target: { id: "parking", value } })
                    }
                  />
                </FormField>
              </div>
              <div className="mt-6">
                <FormField label="Furnished" id="furnished">
                  <ToggleButtonGroup
                    options={[
                      { label: "Yes", value: true },
                      { label: "No", value: false },
                    ]}
                    value={furnished}
                    onChange={(value) =>
                      onMutate({ target: { id: "furnished", value } })
                    }
                  />
                </FormField>
              </div>
            </Section>
          )}

          {step === 2 && (
            <Section icon={<BsGeoAlt />} title="Location">
              <FormField label="Address" id="address">
                <textarea
                  className="form-textarea"
                  id="address"
                  value={address}
                  onChange={onMutate}
                  required
                />
              </FormField>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <FormField label="City" id="City">
                  <input
                    className="form-input"
                    type="text"
                    id="City"
                    value={City}
                    onChange={(e) =>
                      setFormData((prevState) => ({
                        ...prevState,
                        City: e.target.value.toUpperCase(),
                      }))
                    }
                    required
                  />
                </FormField>
                <FormField label="Country" id="Country">
                  <input
                    className="form-input"
                    type="text"
                    id="Country"
                    value={Country}
                    onChange={(e) =>
                      setFormData((prevState) => ({
                        ...prevState,
                        Country: e.target.value.toUpperCase(),
                      }))
                    }
                    required
                  />
                </FormField>
              </div>
            </Section>
          )}

          {step === 3 && (
            <Section icon={<BsCurrencyDollar />} title="Pricing">
              <FormField label="Offer" id="offer">
                <ToggleButtonGroup
                  options={[
                    { label: "Yes", value: true },
                    { label: "No", value: false },
                  ]}
                  value={offer}
                  onChange={(value) =>
                    onMutate({ target: { id: "offer", value } })
                  }
                />
              </FormField>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <FormField label="Regular Price" id="regularPrice">
                  <div className="relative">
                    <input
                      className="form-input pr-16"
                      type="number"
                      id="regularPrice"
                      value={regularPrice}
                      onChange={onMutate}
                      min="50"
                      max="750000000"
                      required
                    />
                    {type === "rent" && (
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        $ / Month
                      </span>
                    )}
                  </div>
                </FormField>
                {offer && (
                  <FormField label="Discounted Price" id="discountedPrice">
                    <input
                      className="form-input"
                      type="number"
                      id="discountedPrice"
                      value={discountedPrice}
                      onChange={onMutate}
                      min="50"
                      max="750000000"
                      required={offer}
                    />
                  </FormField>
                )}
              </div>
            </Section>
          )}

          {step === 4 && (
            <Section icon={<BsImages />} title="Images & Description">
              <FormField label="Images" id="images">
                <p className="text-gray-500 text-sm mb-2">
                  The first image will be the cover (max 6).
                </p>
                <input
                  className="form-input"
                  type="file"
                  id="images"
                  onChange={onMutate}
                  max="6"
                  accept=".jpg,.png,.jpeg"
                  multiple
                  required
                />
              </FormField>
              <FormField label="Description" id="description">
                <textarea
                  className="form-textarea"
                  id="description"
                  value={description}
                  onChange={onMutate}
                  required
                />
              </FormField>
            </Section>
          )}

          <div className="flex justify-between mt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition duration-300"
              >
                Previous
              </button>
            )}
            {step < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition duration-300 ml-auto"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition duration-300 ml-auto"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Listing"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

function ProgressBar({ currentStep, totalSteps }) {
  return (
    <div className="relative pt-1">
      <div className="flex mb-2 items-center justify-between">
        {[...Array(totalSteps)].map((_, index) => (
          <div
            key={index}
            className={`text-xs md:text-sm font-semibold inline-block py-1 px-2 md:px-4 uppercase rounded-full ${
              index + 1 <= currentStep
                ? "text-white bg-primary"
                : "text-gray-700 bg-light"
            }`}
          >
            Step {index + 1}
          </div>
        ))}
      </div>
      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-light">
        <div
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"
        ></div>
      </div>
    </div>
  );
}

function Section({ icon, title, children }) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 md:p-8 space-y-6">
      <h2 className="text-2xl md:text-3xl font-semibold flex items-center text-gray-800">
        {icon && <span className="mr-3 text-primary">{icon}</span>}
        {title}
      </h2>
      {children}
    </div>
  );
}

function FormField({ label, id, children }) {
  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function ToggleButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      className={`px-4 py-2 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 ${
        active
          ? "bg-primary text-white shadow-md"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function ToggleButtonGroup({ options, value, onChange }) {
  return (
    <div className="flex space-x-4">
      {options.map((option) => (
        <ToggleButton
          key={option.value.toString()}
          active={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </ToggleButton>
      ))}
    </div>
  );
}

export default CreateListing;
