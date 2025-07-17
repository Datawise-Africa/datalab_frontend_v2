import { useState, useRef, useEffect } from 'react';
import { Search, X, ChevronDown, Check } from 'lucide-react';

interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options?: Option[];
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
  onSelectionChange?: (selectedValues: string | string[]) => void;
  multiple?: boolean;
  defaultValue?: string | string[];
  disabled?: boolean;
}

const MultiSelect2: React.FC<MultiSelectProps> = ({
  options = [],
  placeholder = 'Select items...',
  searchPlaceholder = 'Search...',
  className = '',
  onSelectionChange = () => {},
  multiple = true,
  defaultValue,
  disabled = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  // Sample options if none provided
  const defaultOptions: Option[] = [];

  const finalOptions: Option[] = options.length > 0 ? options : defaultOptions;

  const [selectedItems, setSelectedItems] = useState<Option[]>(() => {
    if (defaultValue) {
      const values = Array.isArray(defaultValue)
        ? defaultValue
        : [defaultValue];
      const availableOptions = options.length > 0 ? options : defaultOptions;
      return values
        .map((value) =>
          availableOptions.find((option) => option.value === value),
        )
        .filter((option): option is Option => option !== undefined);
    }
    return [];
  });

  // Filter options based on search term
  const filteredOptions: Option[] = finalOptions.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const toggleDropdown = (): void => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setSearchTerm('');
      }
    }
  };

  const selectItem = (option: Option): void => {
    if (multiple) {
      // Check if item is already selected
      const existingIndex = selectedItems.findIndex(
        (item) => item.value === option.value,
      );

      if (existingIndex > -1) {
        // Item is selected, remove it (uncheck)
        const newSelection = selectedItems.filter(
          (item) => item.value !== option.value,
        );
        setSelectedItems(newSelection);
        onSelectionChange(newSelection.map((item) => item.value));
      } else {
        // Item is not selected, add it (check)
        const newSelection = [...selectedItems, option];
        setSelectedItems(newSelection);
        onSelectionChange(newSelection.map((item) => item.value));
      }
    } else {
      const newSelection = [option];
      setSelectedItems(newSelection);
      onSelectionChange(option.value);
      setIsOpen(false); // Close dropdown after single selection
    }
    setSearchTerm('');
  };

  const removeItem = (valueToRemove: string): void => {
    const newSelection = selectedItems.filter(
      (item) => item.value !== valueToRemove,
    );
    setSelectedItems(newSelection);
    onSelectionChange(
      multiple
        ? newSelection.map((item) => item.value)
        : newSelection[0]?.value || '',
    );
  };

  const clearAll = (): void => {
    setSelectedItems([]);
    onSelectionChange(multiple ? [] : '');
  };

  const isSelected = (option: Option): boolean => {
    return selectedItems.some((item) => item.value === option.value);
  };

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      {/* Main trigger button */}
      <button
        type="button"
        onClick={toggleDropdown}
        disabled={disabled}
        className={`min-h-[2.5rem] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-left shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
          disabled ? 'cursor-not-allowed opacity-50' : 'hover:border-gray-400'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {selectedItems.length === 0 ? (
              <span className="text-gray-500">{placeholder}</span>
            ) : multiple ? (
              <div className="flex flex-wrap gap-1">
                {selectedItems.map((item) => (
                  <span
                    key={item.value}
                    className="inline-flex items-center rounded-md border border-blue-200 bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800"
                  >
                    {item.label}
                    {!disabled && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          removeItem(item.value);
                        }}
                        className="ml-1 rounded-full p-0.5 transition-colors hover:bg-blue-200"
                      >
                        <X size={12} />
                      </span>
                    )}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-gray-900">{selectedItems[0]?.label}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {selectedItems.length > 0 && !disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  clearAll();
                }}
                className="text-gray-400 transition-colors hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
            <ChevronDown
              size={16}
              className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />
          </div>
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-hidden rounded-md border border-gray-300 bg-white shadow-lg">
          {/* Search input */}
          <div className="border-b border-gray-200 p-2">
            <div className="relative">
              <Search
                size={16}
                className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400"
              />
              <input
                ref={searchInputRef}
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md border border-gray-300 py-2 pr-3 pl-9 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Options list */}
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500">
                {searchTerm
                  ? 'No results found'
                  : multiple
                    ? 'No more options available'
                    : 'No options available'}
              </div>
            ) : (
              filteredOptions.map((option) => {
                const optionSelected = isSelected(option);
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => selectItem(option)}
                    className={`flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-gray-50 focus:bg-gray-50 focus:outline-none ${
                      optionSelected && !multiple
                        ? 'bg-blue-50 text-blue-900'
                        : ''
                    }`}
                  >
                    {multiple && (
                      <div className="flex-shrink-0">
                        <div
                          className={`flex h-4 w-4 items-center justify-center rounded border-2 transition-colors ${
                            optionSelected
                              ? 'border-blue-600 bg-blue-600'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {optionSelected && (
                            <Check size={12} className="text-white" />
                          )}
                        </div>
                      </div>
                    )}
                    <span className="flex-1 text-sm">{option.label}</span>
                    {!multiple && optionSelected && (
                      <Check
                        size={16}
                        className="flex-shrink-0 text-blue-600"
                      />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer with selection count - only show for multiple selection */}
          {selectedItems.length > 0 && multiple && (
            <div className="border-t border-gray-200 bg-gray-50 px-3 py-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">
                  {selectedItems.length} item
                  {selectedItems.length !== 1 ? 's' : ''} selected
                </span>
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-xs text-blue-600 transition-colors hover:text-blue-800"
                >
                  Clear all
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default MultiSelect2;
