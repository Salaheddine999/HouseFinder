import { useLocation } from "react-router-dom"
import { useState } from "react";
import { Link } from "react-router-dom";
import useAuthStatus from "../hooks/useAuthStatus"

function Navbar(){


      const [navbar, setNavbar] = useState(false);

      const location = useLocation()
      const{loggedIn} = useAuthStatus()

      const pathMatchRoute = (route) =>{
          if(route===location.pathname){
              return true
          }
      }

     return (
        <>
        <nav className="bg-white font-normal sticky top-0 z-50 tablet:opacity-95 border border-b-2 tablet:border-none drop-shadow-md rounded-bl-xl rounded-br-xl">
          <div className="justify-between px-4 mx-auto tablet:py-1 tablet:mx-4 laptop:items-center laptop:flex laptop:px-8">
              <div>
                  <div className="flex items-center justify-between py-3 laptop:py-5 md:block">
                      <Link to={'/'}>
                          <h2 className="text-2xl font-bold">HouseFinder</h2>
                      </Link>
                      <div className="laptop:hidden">
                          <button
                              className="p-2 rounded-md outline-none"
                              onClick={() => setNavbar(!navbar)}
                          >
                              {navbar ? (
                                  <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="w-6 h-6"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                  >
                                      <path
                                          fillRule="evenodd"
                                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                          clipRule="evenodd"
                                      />
                                  </svg>
                              ) : (
                                  <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="w-6 h-6"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                      strokeWidth={2}
                                  >
                                      <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M4 6h16M4 12h16M4 18h16"
                                      />
                                  </svg>
                              )}
                          </button>
                      </div>
                  </div>
              </div>
              <div>
                  <div
                      className={`flex-1 justify-self-center pb-3 mt-8 laptop:block laptop:pb-0 laptop:mt-0 ${
                          navbar ? "block" : "hidden"
                      }`}
                  >
                      <ul className="items-center font-medium justify-center space-y-8 laptop:flex laptop:space-x-10 laptop:space-y-0">
                          <Link to={'/'} className={pathMatchRoute('/') ? 'text-black' : 'text-gray-500'}>
                              Home
                          </Link>

                          <Link to={'/category/rent'} className={pathMatchRoute('/category/rent') ? 'text-black' : 'text-gray-500'}>
                              Rent
                          </Link>

                          <Link to={'/category/sale'} className={pathMatchRoute('/category/sale') ? 'text-black' : 'text-gray-500'}>
                              Buy
                          </Link>

                          <Link to={'/profile'} className="px-8 py-3 font-semibold rounded bg-primary text-white w-fit">
                              {loggedIn ? 'Profile' : 'Sign in'}
                          </Link>
                      </ul>
                  </div>
              </div>
          </div>
      </nav>
      </>
     )
}

export default Navbar