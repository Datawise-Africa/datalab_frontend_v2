import { ChevronRight, Menu } from 'lucide-react';

export default function DraftSidebar({ sidebarOpen, toggleSidebar }) {
  return (
    <div
      className={`fixed md:relative z-10 h-full border-r border-[#E5E7EB] bg-white shadow-sm transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-0 md:w-16 overflow-hidden'
      }`}
    >
      <div className="flex h-14 items-center border-b border-[#E5E7EB] px-4">
        <button
          className="flex items-center justify-center w-8 h-8 mr-2 rounded-md hover:bg-gray-100"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </button>
        {sidebarOpen && <span className="text-sm font-medium">Collapse</span>}
      </div>
      <div className="p-4">
        <div
          className={`flex items-center ${
            sidebarOpen ? 'space-x-3' : 'justify-center'
          } rounded-md border p-3`}
        >
          <div className="relative h-10 w-10 overflow-hidden rounded-full flex-shrink-0">
            <div className="bg-gray-300 h-full w-full rounded-full" />
          </div>
          {sidebarOpen && (
            <>
              <div className="min-w-0">
                <div className="font-medium truncate">Data Explorer</div>
                <div className="text-xs text-gray-500 truncate">
                  Albert Kahira
                </div>
              </div>
              <ChevronRight className="ml-auto h-5 w-5 text-gray-400 flex-shrink-0" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
