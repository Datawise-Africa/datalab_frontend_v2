import { useRef, useEffect } from 'react';
import { X, Database, LayoutDashboard, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

type DraftMobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function DraftMobileMenu({ isOpen, onClose }: DraftMobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside the mobile menu to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Mobile menu overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={onClose}
        />
      )}

      {/* Mobile menu */}
      <div
        ref={menuRef}
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-14 items-center border-b border-subtle px-4">
          <button
            className="flex items-center justify-center w-8 h-8 mr-2 rounded-md hover:bg-gray-100"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close menu</span>
          </button>
          <span className="text-sm font-medium">Menu</span>
        </div>
        <div className="p-4">
          <div className="flex items-center space-x-3 rounded-md border border-subtle p-3 mb-4">
            <div className="relative h-10 w-10 overflow-hidden rounded-full">
              <div className="bg-gray-300 h-full w-full rounded-full" />
            </div>
            <div>
              <div className="font-medium">Data Explorer</div>
              <div className="text-xs text-gray-500">Albert Kahira</div>
            </div>
          </div>
          <nav className="flex flex-col space-y-4">
            <Link
              to="/datasets"
              className="flex items-center text-gray-700 hover:text-gray-900 p-2 rounded-md hover:bg-gray-100"
            >
              <Database className="mr-2 h-5 w-5" />
              <span>Datasets</span>
            </Link>
            <Link
              to="/dashboards"
              className="flex items-center text-gray-700 hover:text-gray-900 p-2 rounded-md hover:bg-gray-100"
            >
              <LayoutDashboard className="mr-2 h-5 w-5" />
              <span>Dashboards</span>
            </Link>
            <Link
              to="/reports"
              className="flex items-center text-gray-700 hover:text-gray-900 p-2 rounded-md hover:bg-gray-100"
            >
              <FileText className="mr-2 h-5 w-5" />
              <span>Reports</span>
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}
