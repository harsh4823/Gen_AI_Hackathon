import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GiLindenLeaf } from "react-icons/gi";
import { FaSignInAlt, FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
    // Get the current path to highlight the active link
    const location = useLocation();
    const path = location.pathname;

    // State to manage the visibility of the mobile menu
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Function to toggle the menu state
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className='sm:h-[90px] h-[70px] bg-white text-[var(--artisan-brown)] z-50 flex items-center sticky top-0 shadow-md'>
            <div className='lg:px-14 sm:px-8 px-4 w-full flex justify-between items-center'>
                {/* Logo and Brand Name */}
                <Link to={"/"} className='flex items-center text-2xl font-bold z-50'>
                    <GiLindenLeaf className='mr-2 text-3xl' />
                    <span>AI-Artisan</span>
                </Link>

                {/* Navigation Links - Sidebar for mobile, inline for larger screens */}
                <ul className={`flex sm:gap-10 gap-4 sm:items-center text-[var(--artisan-brown)] 
                    sm:static absolute top-0 sm:shadow-none shadow-md
                    transition-all duration-300 ease-in-out sm:h-fit h-screen sm:bg-transparent bg-white
                    sm:w-fit w-[70%] sm:flex-row flex-col px-4 sm:px-0 sm:pt-0 pt-24
                    ${isMenuOpen ? 'left-0' : 'left-[-100%]'}`}> {/* This line controls the sidebar visibility */}
                    
                    {/* --- Menu items --- */}
                    {/* Home */}
                    <li className='font-[500] tracking-all duration-150 pt-3 sm:text-xl'>
                        <Link to={"/"} onClick={() => setIsMenuOpen(false)}
                            className={`${path === '/' ? 'text-[var(--artisan-dark)] font-bold' : 'text-[var(--artisan-brown)]'}`}>
                            Home
                        </Link>
                    </li>

                    {/* Products */}
                    <li className='font-[500] tracking-all duration-150 pt-3 sm:text-xl'>
                        <Link to={"/products"} onClick={() => setIsMenuOpen(false)}
                            className={`${path === '/products' ? 'text-[var(--artisan-dark)] font-bold' : 'text-[var(--artisan-brown)]'}`}>
                            Products
                        </Link>
                    </li>

                    {/* About */}
                    <li className='font-[500] tracking-all duration-150 pt-3 sm:text-xl'>
                        <Link to={"/about"} onClick={() => setIsMenuOpen(false)}
                            className={`${path === '/about' ? 'text-[var(--artisan-dark)] font-bold' : 'text-[var(--artisan-brown)]'}`}>
                            About
                        </Link>
                    </li>

                    {/* Login */}
                    <li className='font-[500] tracking-all duration-150 py-2 sm:text-xl'>
                        <Link to={"/login"} onClick={() => setIsMenuOpen(false)}
                            className='flex items-center mt-2 px-4 py-1 space-x-2
                            font-semibold rounded-full border-[var(--artisan-dark)] border-2
                            hover:text-white hover:bg-[var(--artisan-dark)]
                            transition duration-300 ease-in-out transform'>
                            <FaSignInAlt /><span>Login</span>
                        </Link>
                    </li>
                </ul>

                {/* Hamburger Menu / Close Icon -- visible only on small screens */}
                <div onClick={toggleMenu} className='sm:hidden z-50 text-2xl cursor-pointer'>
                    {isMenuOpen ? <FaTimes /> : <FaBars />}
                </div>
            </div>
        </div>
    );
};

export default Navbar;