import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { navigation, type NavigationItem } from '@/constants';

const Header = () => {
  const [openNavigation, setOpenNavigation] = useState(false);
  const [isNavItemDropdown, setIsNavItemDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
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

  const handleNavItemClick = (e: React.MouseEvent, item: NavigationItem) => {
    e.preventDefault();

    if (
      // item.hasDropdown
      item.dropdownItems.length > 0
    ) {
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
        className={`fixed top-0 left-0 z-50 w-full border-b border-[#DDDDDD] lg:backdrop-blur-sm ${
          openNavigation ? 'bg-[]' : 'bg-[]'
        }`}
      >
        <div className="container mx-auto flex items-center justify-between p-2 px-5 max-lg:py-4 lg:px-8">
          <Link to="/" className="w-[12rem]">
            <img
              src={'/assets/Datawise.svg'}
              alt="Datawise logo"
              loading="lazy"
              width={180}
              height={20}
            />
          </Link>

          {/* Mobile hamburger menu */}
          <button
            className="text-white lg:hidden"
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
            className={` ${openNavigation ? 'flex' : 'hidden'} fixed top-[4rem] right-0 bottom-0 left-0 flex-col bg-[#0F2542] pt-8 lg:static lg:flex lg:flex-1 lg:flex-row lg:items-center lg:justify-between lg:bg-transparent lg:pt-0`}
          >
            <nav className="flex flex-col items-center lg:mx-auto lg:flex-row">
              <div
                className="relative z-2 flex flex-col items-center lg:flex-row"
                ref={dropdownRef}
              >
                {navigation.map((item) => (
                  <div key={item.id} className="group relative mb-4 lg:mb-0">
                    <Link
                      to={item.url}
                      className={`border-b-4 px-4 py-2 text-lg font-semibold text-[#0F4539] ${
                        item.url === pathname
                          ? 'rounded border-[#188366] text-[#188366]'
                          : 'border-transparent'
                      } group-hover:text-[#188366]`}
                      onClick={(e) => handleNavItemClick(e, item)}
                    >
                      <img
                        src={item.icon}
                        alt={`${item.title} icon`}
                        className="mr-2 inline-block h-4 w-4"
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
