import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import datawise_logo from '/assets/Datawise.svg';
// import dwise_logo from "/assets/datawise-logo-icon-dark.svg";
import { navigation } from '../../constants';
import MaxWidth from '../designs/MaxWidth';
import { Database, FileText, LayoutDashboard, Menu } from 'lucide-react';

const Header = ({onToggleMobileMenu}) => {
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
        <header className="flex h-14 items-center justify-between border-b border-[#E5E7EB] bg-white px-4 md:px-6">
      <div className="flex items-center">
        {/* Mobile menu trigger */}
        <button
          className="flex md:hidden items-center justify-center w-8 h-8 mr-2 rounded-md hover:bg-gray-100"
          onClick={onToggleMobileMenu}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </button>

        <Link to="/" className="flex items-center">
          <div className="relative h-8 w-8 mr-2">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="grid grid-cols-3 gap-0.5">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-1.5 w-1.5 rounded-full"
                    style={{
                      backgroundColor: [
                        "#FF5733",
                        "#33FF57",
                        "#3357FF",
                        "#FF33A8",
                        "#33FFF5",
                        "#F5FF33",
                        "#FF8333",
                        "#33FF83",
                        "#8333FF",
                      ][i % 9],
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          <span className="font-semibold text-lg">Datawise Africa</span>
        </Link>
      </div>
      <nav className="hidden md:flex items-center space-x-8">
        <Link to="/datasets" className="flex items-center text-gray-700 hover:text-gray-900">
          <Database className="mr-2 h-5 w-5" />
          <span>Datasets</span>
        </Link>
        <Link to="/dashboards" className="flex items-center text-gray-700 hover:text-gray-900">
          <LayoutDashboard className="mr-2 h-5 w-5" />
          <span>Dashboards</span>
        </Link>
        <Link to="/reports" className="flex items-center text-gray-700 hover:text-gray-900">
          <FileText className="mr-2 h-5 w-5" />
          <span>Reports</span>
        </Link>
      </nav>
    </header>
  );
};

export default Header;
