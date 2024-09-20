import { useState } from "react";
import { Rating } from "../components/Rating";
import Offers from "./Offers";
import { BiSearch } from "react-icons/bi";
import { BsHouseCheck } from "react-icons/bs";
import { IoMdContacts } from "react-icons/io";
import { AiOutlinePercentage } from "react-icons/ai";
import {
  FaSuitcase,
  FaClock,
  FaCalendarCheck,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { BsSearch } from "react-icons/bs";
import { Link } from "react-router-dom";
import Latest from "./Latest";
import Testimonials from "../components/Testimonials";

function Explore() {
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("");

  const [options] = useState([
    {
      title: "Find Your Dream House",
      description:
        "We provide various types of houses from the cheapest to Premium",
      icon: <BiSearch />,
    },
    {
      title: "Best Quality Guarantee",
      description:
        "If you buy or rent a house with us you are guaranteed with the best quality",
      icon: <BsHouseCheck />,
    },
    {
      title: "Contact with Landlord",
      description:
        "You will have direct contact with the owner or representative of the property.",
      icon: <IoMdContacts />,
    },
    {
      title: "No Agent or Commissions",
      description:
        "Buy, sell or rent your properties without any agent or commisions.",
      icon: <AiOutlinePercentage />,
    },
  ]);

  const [ratings] = useState([
    {
      description:
        "Having to get services like buying a house just by visiting a website and booking an appointment wasn't quite a thing for me. But, now Estately change my point of view concerning Real Estates.",
      author: "Arthuro Guevara",
      position: "Client",
    },
    {
      description:
        "I always have hard times working with real estate agencies, but with estately whole process was easy, smooth and quick! Agent Lucas is professional at what he does so its very comfortable working with him",
      author: "Manuel Ramirez",
      position: "Investor",
    },
    {
      description:
        "HouseFinder made my house hunting experience a breeze. Their user-friendly platform and extensive listings helped me find my dream home in no time!",
      author: "Sarah Johnson",
      position: "Homeowner",
    },
    {
      description:
        "As a first-time seller, I was nervous about the process. HouseFinder's team guided me through every step, ensuring I got the best value for my property.",
      author: "Michael Chen",
      position: "Property Seller",
    },
  ]);

  const [faqs] = useState([
    {
      question: "How do I search for properties on HouseFinder?",
      answer:
        "You can use our search bar at the top of the page to enter your desired location, price range, and property type. Our advanced filters will help you find the perfect property.",
    },
    {
      question: "Are there any fees for using HouseFinder?",
      answer:
        "Estately is free to use for property searchers. We don't charge any commissions or fees for connecting you with property owners or agents.",
    },
    {
      question: "How can I list my property on HouseFinder?",
      answer:
        "To list your property, simply create an account and click on 'List a Property' in your dashboard. Follow the steps to add details, photos, and set your price.",
    },
    {
      question: "How to contact the owner?",
      answer:
        "You can contact the owner by clicking on the property and then on the contact owner button.",
    },
  ]);

  const [showBorder, setShowBorder] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const checkInputs = (e) => {
    if (!city || !country || !price || !type) {
      e.preventDefault();
      setShowBorder(true);
    }
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <>
      <div className="tablet:mt-12">
        <div className="tablet:relative">
          <div>
            <img
              src={require("../images/Estately.webp")}
              alt=""
              className="tablet:rounded-xl tablet:inline h-[350px] w-full object-cover object-right tablet:h-full"
            />
          </div>
          <div className="tablet:absolute tablet:bottom-5 tablet:ml-8 laptop:ml-20 tablet:top-0 tablet:mt-10 absolute top-28">
            <h1 className="text-darker mx-5 tablet:mx-0 font-bold text-4xl tablet:text-2xl laptop:text-6xl tablet:mb-3 laptop:mb-3">
              Find your perfect <span className="text-primary">future</span>
              <br /> home.
            </h1>
            <div className="text-gray-800 text-md laptop:text-lg tablet:text-xs mx-5 tablet:pt-0 pt-5 tablet:mx-0 tablet:mb-2 laptop:mb-4 laptop:mt-4">
              A great platform to buy, sell and rent your properties
              <br />
              without any agent or commisions.
            </div>
            <div className="text-primary text-lg laptop:mb-32 tablet:mb-12 mx-4 tablet:mx-0">
              <div className="">
                <span className="text-gray-800 font-bold text-sm laptop:text-md">
                  $20,5M{" "}
                </span>
                <span className="text-gray-800 text-sm laptop:text-md">
                  Earned throught property transactions
                </span>
              </div>
              <div>
                <span className="text-gray-800 font-bold text-sm laptop:text-md">
                  +19k{" "}
                </span>
                <span className="text-gray-800 text-sm laptop:text-md">
                  Earned throught property transactions
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="grid text-left mx-8 -mt-6 tablet:mt-0 tablet:relative tablet:flex tablet:justify-start tablet:flex-col laptop:mx-12 tablet:mx-6 laptop:bottom-28 tablet:bottom-16">
          <div className="tablet:sticky tablet:flex tablet:flex-row tablet:justify-between bg-white p-10 tablet:p-4 laptop:p-10 rounded-xl drop-shadow-xl">
            <div className="flex flex-col mb-5 tablet:mb-0">
              <div className="text-gray-900 font-semibold mb-1 text-lg tablet:pb-1 tablet:text-sm laptop:text-lg">
                City
              </div>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                id="City"
                placeholder="New York"
                required
                className={`tablet:w-4/5 laptop:w-full rounded-md shadow-sm tablet:text-sm bg-gray-100 ${
                  showBorder && !city
                    ? "border-red-500 border-2"
                    : "border-gray-100"
                }`}
              />
            </div>
            <div className="flex flex-col mb-5 tablet:mb-0">
              <div className="text-gray-900 font-semibold mb-1 text-lg tablet:pb-1 tablet:text-sm laptop:text-lg">
                Country
              </div>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                id="Country"
                required
                placeholder="United States"
                className={`tablet:w-4/5 laptop:w-full rounded-md shadow-sm tablet:text-sm bg-gray-100 ${
                  showBorder && !country
                    ? "border-red-500 border-2"
                    : "border-gray-100"
                }`}
              />
            </div>

            <div className="flex flex-col mb-5 tablet:mb-0">
              <div className="text-gray-900 font-semibold mb-1 text-lg tablet:pb-1 tablet:text-sm laptop:text-lg">
                Max Price
              </div>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                id="price"
                required
                placeholder="$ 3,500"
                className={`tablet:w-4/5 laptop:w-full rounded-md shadow-sm tablet:text-sm bg-gray-100 ${
                  showBorder && !price
                    ? "border-red-500 border-2"
                    : "border-gray-100"
                }`}
              />
            </div>
            <div className="flex flex-col mb-5 tablet:mb-0">
              <div className="text-gray-900 font-semibold mb-1 text-lg tablet:pb-1 tablet:text-sm laptop:text-lg">
                Property Type
              </div>
              <div className="flex w-full justify-center">
                <div>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    required
                    className={`tablet:w-4/5 laptop:w-full rounded-md shadow-sm tablet:text-sm bg-gray-100 ${
                      showBorder && !type
                        ? "border-red-500 border-2"
                        : "border-gray-100"
                    }`}
                  >
                    <option>Select Property Type</option>
                    <option value="rent">Rent</option>
                    <option value="sale">Sale</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="mx-20 tablet:mx-0 tablet:self-end">
              <Link
                to={`/search/${city}/${country}/${price}/${type}`}
                onClick={checkInputs}
                className="bg-primary text-white py-2 px-8 tablet:px-10 tablet:py-2 rounded-md hover:bg-dark"
              >
                <BsSearch className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Options */}
      <div className="mt-20 tablet:mt-0 mx-4 tablet:mx-24 text-center laptop:text-left laptop:mt-0 laptop:justify-center laptop:flex laptop:flex-row mb-20">
        {options.map((option) => (
          <div className="box-content drop-shadow-md laptop:drop-shadow-xs laptop:mx-4 my-6 py-2 px-2 laptop:my-0 laptop:text-sm laptop:w-52 laptop:py-8 laptop:px-4 bg-white hover:drop-shadow-xl rounded-xl cursor-pointer">
            <div className="grid justify-items-center laptop:flex laptop:flex-row laptop:items-center tablet:mb-3">
              <p className="text-3xl text-white mb-2 bg-primary py-2 px-2 laptop:px-3 tablet:py-1 laptop:py-2 tablet:mr-3 laptop:mr-4 rounded-lg tablet:text-xl laptop:text-2xl">
                {option.icon}
              </p>
              <p className="text-darker text-xl font-bold tablet:text-md laptop:text-xl">
                {option.title}
              </p>
            </div>
            <div className="text-gray-400 text-md">{option.description}</div>
          </div>
        ))}
      </div>
      <div className="flex flex-col mb-14">
        <div className="flex flex-col items-center justify-center mb-4">
          <h1 className="text-darker font-bold text-3xl text-center tablet:text-4xl mb-3">
            Discover Best Offer Properties
          </h1>
          <h2 className="text-gray-500 text-base font-medium">
            The best deals for your future house
          </h2>
        </div>
        <Offers />
      </div>

      <div className="grid mb-10 laptop:mb-24 laptop:flex laptop:flex-row laptop:items-center laptop:justify-center static">
        <div className="w-9/12 grid justify-items-center laptop:flex relative mb-72 laptop:mb-96 tablet:mb-[400px]">
          <div className="drop-shadow-3xl w-9/12 laptop:w-6/12 absolute laptop:right-60 laptop:top-0 laptop:z-0">
            <img src={require("../images/f3.png")} alt="building" />
          </div>
          <div className="drop-shadow-3xl w-9/12 laptop:w-6/12 absolute left-32 laptop:right-0 laptop:left-80 top-20 z-20">
            <img src={require("../images/f2.png")} alt="building" />
          </div>
        </div>

        <div className="box-content text-center grid justify-items-center laptop:justify-items-left laptop:text-left laptop:w-96 laptop:mr-36  h-fit p-5">
          <div id="about">
            <h2 className="text-primary text-lg font-normal">
              <span className="text-dark font-bold">About</span> Our Company
            </h2>
            <h1 className="text-darker text-2xl font-bold my-6">
              We are Offering the Best Real Estate Deals
            </h1>
            <p className="text-gray-500 text-sm my-2">
              With over 1,000 houses sold, we’re committed to connecting people
              with the best real estate opportunities. Whether you're renting or
              buying, our platform makes finding your perfect home simple and
              stress-free. Trust us for transparent deals and exceptional
              service tailored to your needs.
            </p>
          </div>
          <div className="text-white flex flex-row text-xl justify-between my-10 box-content w-72">
            <p className="bg-primary py-3 px-4 rounded-lg cursor-pointer">
              <FaCalendarCheck />
            </p>
            <div className="bg-primary py-3 px-4 rounded-lg flex flex-row items-center cursor-pointer">
              <FaClock />
              <p className="ml-2 text-sm">24 H Consultant</p>
            </div>
            <p className="bg-primary py-3 px-4 rounded-lg cursor-pointer">
              <FaSuitcase />
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col mt-4 mb-10 px-4 tablet:px-8">
        <h1 className="text-darker font-bold text-2xl tablet:text-3xl laptop:text-4xl text-center mb-3">
          Recently Added Listings
        </h1>
        <h2 className="text-gray-500 text-sm tablet:text-base font-medium text-center">
          Find the latest properties added to our listings
        </h2>
        <hr className="w-16 mt-2 mb-4" />
        <Latest />
      </div>

      <div
        className="flex flex-col mb-16 px-4 tablet:px-8 lg:px-16"
        id="testimonials"
      >
        <div className="flex flex-col items-center justify-center mb-4">
          <h1 className="text-darker font-bold text-2xl tablet:text-3xl lg:text-4xl text-center mb-3">
            What our customers are saying about us
          </h1>
        </div>
        <div className="w-full max-w-5xl mx-auto">
          <Testimonials ratings={ratings} />
        </div>
      </div>

      {/* FAQ Section */}
      <div
        className="flex flex-col mb-20 px-4 tablet:px-8 laptop:px-16 my-14"
        id="faq"
      >
        <div className="flex flex-col items-center justify-center mb-8">
          <h1 className="text-darker font-bold text-2xl tablet:text-3xl laptop:text-4xl text-center mb-3">
            Frequently Asked Questions
          </h1>
          <h2 className="text-gray-500 text-sm tablet:text-base font-medium text-center">
            Find answers to common questions about Estately
          </h2>
        </div>
        <div className="w-full max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="mb-4">
              <button
                className="flex justify-between items-center w-full text-left font-semibold p-3 tablet:p-4 bg-gray-100 hover:bg-gray-200 rounded-lg focus:outline-none"
                onClick={() => toggleFaq(index)}
              >
                <span className="text-sm tablet:text-base pr-4">
                  {faq.question}
                </span>
                {openFaq === index ? (
                  <FaChevronUp className="flex-shrink-0" />
                ) : (
                  <FaChevronDown className="flex-shrink-0" />
                )}
              </button>
              {openFaq === index && (
                <div className="p-3 tablet:p-4 bg-white border border-gray-200 rounded-b-lg">
                  <p className="text-sm tablet:text-base text-gray-600">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="flex flex-col items-center justify-center bg-primary text-white py-12 px-4 mx-4 tablet:mx-0 tablet:px-8 laptop:px-16 rounded-xl mb-10 bg-opacity-70">
        <h2 className="text-3xl tablet:text-4xl font-bold mb-4 text-center">
          Ready to Find Your Dream Home?
        </h2>
        <p className="text-lg tablet:text-xl mb-6 text-center">
          Join HouseFinder today and start your journey to the perfect home.
        </p>
        <Link
          to="/signup"
          className="bg-white text-primary py-3 px-6 rounded-md font-semibold hover:bg-gray-200 transition"
        >
          Get Started
        </Link>
      </div>
    </>
  );
}
export default Explore;
