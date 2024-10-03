import { Link } from "react-router-dom";
import logo from "../assets/icon.svg";

function Footer() {
  return (
    <footer className="bg-white text-gray-600 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 tablet:grid-cols-4 laptop:grid-cols-4 desktop:grid-cols-4 gap-8">
          {" "}
          {/* Updated grid columns for responsiveness */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center mb-4">
              <img
                src={logo}
                alt="HouseFinder logo"
                className="h-10 w-10 mr-2"
              />
              <span className="text-2xl font-bold text-primary">
                HouseFinder
              </span>
            </Link>
            <p className="text-sm text-gray-500 mb-4">
              Discover your perfect home with HouseFinder. We simplify the
              process of finding, renting, or buying properties across the
              country.
            </p>
            <div className="flex space-x-4">
              <SocialLink href="#" title="Facebook" icon="facebook" />
              <SocialLink href="#" title="Twitter" icon="twitter" />
              <SocialLink href="#" title="Instagram" icon="instagram" />
              <SocialLink href="#" title="LinkedIn" icon="linkedin" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-primary tracking-wider uppercase mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <NavLink to="/">Home</NavLink>
              </li>
              <li>
                <NavLink to="/category/rent">Rent</NavLink>
              </li>
              <li>
                <NavLink to="/category/sale">Buy</NavLink>
              </li>
              <li>
                <NavLink to="/profile">Profile</NavLink>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-primary tracking-wider uppercase mb-4">
              Support
            </h3>
            <ul className="space-y-2">
              <li>
                <NavLink to="/faq">FAQ</NavLink>
              </li>
              <li>
                <NavLink to="/contact">Contact Us</NavLink>
              </li>
              <li>
                <NavLink to="/privacy-policy">Privacy Policy</NavLink>
              </li>
              <li>
                <NavLink to="/terms-of-service">Terms of Service</NavLink>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-primary tracking-wider uppercase mb-4">
              Contact Us
            </h3>
            <ul className="space-y-2">
              <li>
                Email:{" "}
                <a
                  href="mailto:support@housefinder.com"
                  className="text-gray-600 hover:text-primary"
                >
                  support@house-finder.online
                </a>
              </li>
              <li>
                Phone:{" "}
                <a
                  href="tel:+1234567890"
                  className="text-gray-600 hover:text-primary"
                >
                  +212 527404090
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} HouseFinder. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <a
              href="/privacy-policy"
              className="text-sm text-gray-500 hover:text-primary"
            >
              Privacy Policy
            </a>
            <a
              href="/terms-of-service"
              className="text-sm text-gray-500 hover:text-primary"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function NavLink({ to, children }) {
  return (
    <Link
      to={to}
      className="text-base text-gray-600 hover:text-primary transition-colors duration-300"
    >
      {children}
    </Link>
  );
}

function SocialLink({ href, title, icon }) {
  const icons = {
    facebook: (
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    ),
    twitter: (
      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
    ),
    instagram: (
      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M7.5 21h9a3 3 0 003-3V6a3 3 0 00-3-3h-9a3 3 0 00-3 3v12a3 3 0 003 3z" />
    ),
    linkedin: (
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
    ),
  };

  return (
    <a
      href={href}
      title={title}
      className="text-gray-400 hover:text-primary transition-colors duration-300"
    >
      <span className="sr-only">{title}</span>
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        {icons[icon]}
      </svg>
    </a>
  );
}

export default Footer;
