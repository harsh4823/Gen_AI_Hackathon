import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GiLindenLeaf } from "react-icons/gi";
import { FaSignInAlt, FaBars, FaTimes, FaSignOutAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logOutUser } from "../store/actions/authAction";

const Navbar = () => {
  const location = useLocation();
  const path = location.pathname;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector(state=>state.auth);

  const categories = [
    "All Products",
    "Handmade Crafts",
    "Paintings",
    "Jewelry",
    "Textiles",
    "Woodwork",
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Main Navbar */}
      <div className="sm:h-[90px] h-[70px] bg-white text-[var(--artisan-brown)] z-50 flex items-center sticky top-0 shadow-md">
        <div className="lg:px-14 sm:px-8 px-4 w-full flex justify-between items-center">
          {/* Logo */}
          <Link to={"/"} className="flex items-center text-2xl font-bold z-50">
            <GiLindenLeaf className="mr-2 text-3xl" />
            <span>AI-Artisan</span>
          </Link>

          {/* Links */}
          <ul
            className={`flex sm:gap-10 gap-4 sm:items-center text-[var(--artisan-brown)] 
              sm:static absolute top-0 sm:shadow-none shadow-md
              transition-all duration-300 ease-in-out sm:h-fit h-screen sm:bg-transparent bg-white
              sm:w-fit w-[70%] sm:flex-row flex-col px-4 sm:px-0 sm:pt-0 pt-24
              ${isMenuOpen ? "left-0" : "left-[-100%]"}`}
          >
            {/* Home */}
            <li className="font-[500] pt-3 sm:text-xl">
              <Link
                to={"/"}
                onClick={() => setIsMenuOpen(false)}
                className={`${
                  path === "/"
                    ? "text-[var(--artisan-dark)] font-bold"
                    : "text-[var(--artisan-brown)]"
                }`}
              >
                Home
              </Link>
            </li>

            {/* Categories */}
            <li className="relative font-[500] pt-3 sm:text-xl">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center gap-1 ${
                  path.startsWith("/products")
                    ? "text-[var(--artisan-dark)] font-bold"
                    : "text-[var(--artisan-brown)]"
                }`}
              >
                Categories
                <svg
                  className={`w-4 h-4 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isDropdownOpen && (
                <ul className="absolute top-full left-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg z-50">
                  {categories.map((cat, i) => (
                    <li key={i}>
                      <Link
                        to={`/products?category=${cat}`}
                        className="block px-4 py-2 hover:bg-gray-200 transition"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        {cat}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {/* Products */}
            <li className="font-[500] pt-3 sm:text-xl">
              <Link
                to={"/products"}
                onClick={() => setIsMenuOpen(false)}
                className={`${
                  path === "/products"
                    ? "text-[var(--artisan-dark)] font-bold"
                    : "text-[var(--artisan-brown)]"
                }`}
              >
                Products
              </Link>
            </li>

            {/* Community */}
            <li className="font-[500] pt-3 sm:text-xl">
              <Link
                to="/community"
                onClick={() => setIsMenuOpen(false)}
                className={`${
                  path.startsWith("/community")
                    ? "text-[var(--artisan-dark)] font-bold"
                    : "text-[var(--artisan-brown)]"
                }`}
              >
                Community
              </Link>
            </li>

            {/* Sell Product */}
            <li className="font-[500] pt-3 sm:text-xl">
              <Link
                to={"/sellproduct"}
                onClick={() => setIsMenuOpen(false)}
                className={`${
                  path === "/sellproduct"
                    ? "text-[var(--artisan-dark)] font-bold"
                    : "text-[var(--artisan-brown)]"
                }`}
              >
                Sell Your Product
              </Link>
            </li>

            {/* Auth */}
            {!user?.username ? (
              <>
                <li>
                  <Link
                    to={"/login"}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center mt-2 px-4 py-1 space-x-2
                      font-semibold rounded-full border-[var(--artisan-dark)] border-2
                      hover:text-white hover:bg-[var(--artisan-dark)]
                      transition duration-300"
                  >
                    <FaSignInAlt />
                    <span>Login</span>
                  </Link>
                </li>
              </>
            ) : (
              <li>
                <button
                  onClick={() => {
                    dispatch(logOutUser(navigate,dispatch));
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center mt-2 px-4 py-1 space-x-2
                    font-semibold rounded-full border-red-600 border-2
                    text-red-600 hover:text-white hover:bg-red-600
                    transition duration-300"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </li>
            )}
          </ul>

          {/* Hamburger */}
          <div
            onClick={toggleMenu}
            className="sm:hidden z-50 text-2xl cursor-pointer"
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </div>
        </div>
      </div>

      {/* Secondary bar for +Post (only when user logged in & in community) */}
      {user && path.startsWith("/community") && (
        <div className="bg-[var(--artisan-dark)] text-white py-2 px-4 shadow-md flex justify-end">
          <Link
            to="/community/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-[var(--artisan-dark)] font-semibold hover:bg-gray-100 transition"
          >
            + Post
          </Link>
        </div>
      )}
    </>
  );
};

export default Navbar;
