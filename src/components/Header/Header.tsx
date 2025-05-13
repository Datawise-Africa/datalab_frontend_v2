import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { navigation } from '@/lib/constants';

type HeaderProps = {
  onToggleMobileMenu: () => void;
};
const Header = ({ onToggleMobileMenu }: HeaderProps) => {
  // const [openNavigation, setOpenNavigation] = useState(false);
  const [_isNavItemDropdown, setIsNavItemDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);


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

  return (
    <header className="flex items-center justify-between border-b border-subtle bg-white px-4 md:px-6">
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
          <div className="relative">
            <div className="flex items-center justify-center">
              <img
                src={'/assets/Datawise.svg'}
                alt="Datawise Logo"
                className="h-24 w-24"
              />
            </div>
          </div>
          {/* <span className="font-semibold text-lg">Datawise Africa</span> */}
        </Link>
      </div>
      <nav className="hidden md:flex items-center space-x-8">
        {navigation.map((item) => (
          <Link
            key={item.id}
            to={item.url}
            className="flex items-center text-gray-700 hover:text-gray-900"
          >
            <img src={item.icon} alt={item.title} className="mr-2 h-5 w-5" />
            <span>{item.title}</span>
          </Link>
        ))}
      </nav>
    </header>
  );
};

export default Header;
