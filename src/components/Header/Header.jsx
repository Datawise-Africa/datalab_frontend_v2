import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import datawise_logo from '/assets/datawise-logo-dark.png';
// import dwise_logo from "/assets/datawise-logo-icon-dark.svg";
import { navigation } from '../../constants';

const Header = () => {
  const [openNavigation, setOpenNavigation] = useState(false);
  const [isNavItemDropdown, setIsNavItemDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsNavItemDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const toggleNavigation = () => {
    setOpenNavigation(!openNavigation);
  };

  const handleNavItemClick = (e, item) => {
    e.preventDefault();

    if (item.hasDropdown) {
      setIsNavItemDropdown(!isNavItemDropdown);
    } else {
      navigate(item.url);
      if (openNavigation) {
        toggleNavigation();
      }
    }
  };
  // max-w-7xl mx-auto

  return (
    <div>
      <div
        className={`fixed top-0 left-0 w-full z-50 lg:backdrop-blur-sm border-b border-[#DDDDDD]  ${
          openNavigation ? 'bg-[]' : 'bg-[]'
        }`}
      >
        <div className="container mx-auto flex items-center justify-between px-5 lg:px-8 max-lg:py-4">
          <Link to="/" className="w-[12rem]">
            <img
              src={datawise_logo}
              alt="Datawise logo"
              loading="lazy"
              width={180}
              height={20}
            />
          </Link>

          {/* Mobile hamburger menu */}
          <button
            className="lg:hidden text-white"
            onClick={toggleNavigation}
            aria-label="Toggle navigation menu"
          >
            {openNavigation ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            )}
          </button>

          {/* Navigation and button container */}
          <div
            className={`
            ${openNavigation ? 'flex' : 'hidden'} 
            lg:flex lg:items-center lg:justify-between lg:flex-1
            fixed lg:static top-[4rem] left-0 right-0 bottom-0 
            bg-[#0F2542] lg:bg-transparent
            flex-col lg:flex-row
            pt-8 lg:pt-0
          `}
          >
            <nav className="flex flex-col lg:flex-row items-center lg:mx-auto">
              <div
                className="relative z-2 flex flex-col items-center lg:flex-row"
                ref={dropdownRef}
              >
                {navigation.map((item) => (
                  <div key={item.id} className="relative group mb-4 lg:mb-0">
                    <Link
                      to={item.url}
                      className={`text-[#0F4539] px-4 py-2 font-semibold text-lg border-b-4  ${
                        item.url === pathname
                          ? 'border-[#188366] text-[#188366] rounded'
                          : 'border-transparent'
                      } group-hover:text-[#188366]`}
                      onClick={(e) => handleNavItemClick(e, item)}
                    >
                      <img
                        src={item.icon}
                        alt={`${item.title} icon`}
                        className="inline-block w-4 h-4 mr-2"
                      />
                      {item.title}
                    </Link>
                  </div>
                ))}
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
