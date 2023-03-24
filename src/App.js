import {BrowserRouter, Routes, Route} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Explore from "./pages/Explore";
import Offers from "./pages/Offers";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import Category from "./pages/Category";
import CreateLising from "./pages/CreateListing";
import Listing from "./pages/Listing";
import Contact from "./pages/Contact";
import EditListing from "./pages/EditListing";
import Footer from "./components/Footer";
import Search from "./pages/Search";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Navbar/>
        <main className="flex flex-col flex-grow min-h-screen desktop:max-w-7xl desktop:mx-auto mx-auto tablet:mx-10 ">
          <Routes>
          <Route path="/" element={<Explore />}/>
          <Route path="/profile" element={<PrivateRoute/>}>
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/offers" element={<Offers />} />
          <Route path="/category/:categoryName" element={<Category />} />
          <Route path="/category/:categoryName/:listingId" element={<Listing />} />
          <Route path="/create-listing" element={<CreateLising />}/>
          <Route path="/edit-listing/:listingId" element={<EditListing />}/>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/contact/:landlordId" element={<Contact />} />
          <Route path="/search/:city/:country/:price/:type" element={<Search />} />
          <Route path='/notfound' element= {<NotFound/>} />
          <Route path='/*' element= {<NotFound/>} />
        </Routes>
        </main>
        <Footer/>
      </BrowserRouter> 
      <ToastContainer/>
    </div>
  );
}

export default App;
