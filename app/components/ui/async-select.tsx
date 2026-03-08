import * as React from 'react';
import { Check, ChevronsUpDown, X, Loader2 } from 'lucide-react';
import { cn } from '~/lib/utils';
import { Button } from '~/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
} from '~/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';
import { Badge } from '~/components/ui/badge';
import { ScrollArea } from '~/components/ui/scroll-area';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  [key: string]: unknown;
}

interface AsyncSelectBaseProps {
  /** Placeholder text when no selection */
  placeholder?: string;
  /** Placeholder for search input */
  searchPlaceholder?: string;
  /** Text shown when no options found */
  emptyText?: string;
  /** Text shown while loading */
  loadingText?: string;
  /** Static options (used when not async) */
  options?: SelectOption[];
  /** Async function to fetch options based on search query */
  onSearch?: (query: string) => Promise<SelectOption[]>;
  /** Debounce delay for search in ms */
  debounceMs?: number;
  /** Whether to show loading state */
  isLoading?: boolean;
  /** Whether the select is disabled */
  disabled?: boolean;
  /** Whether the select is read-only (shows value but prevents interaction) */
  readOnly?: boolean;
  /** Custom class name for the trigger button */
  className?: string;
  /** Minimum characters before triggering search */
  minSearchLength?: number;
  /** Whether to clear search input on selection */
  clearSearchOnSelect?: boolean;
}

interface SingleSelectProps extends AsyncSelectBaseProps {
  /** Enable multiple selection */
  multiple?: false;
  /** Currently selected value */
  value?: string | null;
  /** Callback when value changes */
  onChange?: (value: string | null) => void;
}

interface MultiSelectProps extends AsyncSelectBaseProps {
  /** Enable multiple selection */
  multiple: true;
  /** Currently selected values */
  value?: string[];
  /** Callback when values change */
  onChange?: (value: string[]) => void;
  /** Maximum number of selections allowed */
  maxSelections?: number;
}

export type AsyncSelectProps = SingleSelectProps | MultiSelectProps;

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function AsyncSelect(props: AsyncSelectProps) {
  const {
    placeholder = 'Select...',
    searchPlaceholder = 'Search...',
    emptyText = 'No results found.',
    loadingText = 'Loading...',
    options: staticOptions = [],
    onSearch,
    debounceMs = 300,
    isLoading: externalLoading = false,
    disabled = false,
    readOnly = false,
    className,
    minSearchLength = 0,
    clearSearchOnSelect = true,
    multiple = false,
    value,
    onChange,
  } = props;

  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [asyncOptions, setAsyncOptions] = React.useState<SelectOption[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);

  const debouncedSearch = useDebounce(searchQuery, debounceMs);

  // Fetch options when search query changes (async mode)
  React.useEffect(() => {
    if (!onSearch) return;

    if (debouncedSearch.length < minSearchLength) {
      setAsyncOptions([]);
      return;
    }

    const fetchOptions = async () => {
      setIsSearching(true);
      try {
        const results = await onSearch(debouncedSearch);
        setAsyncOptions(results);
      } catch (error) {
        console.error('Error fetching options:', error);
        setAsyncOptions([]);
      } finally {
        setIsSearching(false);
      }
    };

    fetchOptions();
  }, [debouncedSearch, onSearch, minSearchLength]);

  // Load initial options when opening (async mode with no min search length)
  React.useEffect(() => {
    if (!onSearch || !open || minSearchLength > 0) return;

    const fetchInitialOptions = async () => {
      setIsSearching(true);
      try {
        const results = await onSearch('');
        setAsyncOptions(results);
      } catch (error) {
        console.error('Error fetching initial options:', error);
      } finally {
        setIsSearching(false);
      }
    };

    if (asyncOptions.length === 0) {
      fetchInitialOptions();
    }
  }, [open, onSearch, minSearchLength, asyncOptions.length]);

  const displayOptions = onSearch ? asyncOptions : staticOptions;
  const isLoading = externalLoading || isSearching;

  // Get selected options for display
  const selectedOptions = React.useMemo(() => {
    const allOptions = [...staticOptions, ...asyncOptions];
    if (multiple) {
      const values = (value as string[]) || [];
      return values
        .map((v) => allOptions.find((opt) => opt.value === v))
        .filter(Boolean) as SelectOption[];
    } else {
      const singleValue = value as string | null;
      return singleValue
        ? allOptions.filter((opt) => opt.value === singleValue)
        : [];
    }
  }, [value, staticOptions, asyncOptions, multiple]);

  const handleSelect = (option: SelectOption) => {
    if (multiple) {
      const currentValues = (value as string[]) || [];
      const maxSelections = (props as MultiSelectProps).maxSelections;
      const isSelected = currentValues.includes(option.value);

      let newValues: string[];
      if (isSelected) {
        newValues = currentValues.filter((v) => v !== option.value);
      } else {
        if (maxSelections && currentValues.length >= maxSelections) {
          return; // Don't allow more selections
        }
        newValues = [...currentValues, option.value];
      }

      (onChange as (value: string[]) => void)?.(newValues);
    } else {
      (onChange as (value: string | null) => void)?.(option.value);
      setOpen(false);
    }

    if (clearSearchOnSelect) {
      setSearchQuery('');
    }
  };

  const handleRemove = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (multiple) {
      const currentValues = (value as string[]) || [];
      const newValues = currentValues.filter((v) => v !== optionValue);
      (onChange as (value: string[]) => void)?.(newValues);
    } else {
      (onChange as (value: string | null) => void)?.(null);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (multiple) {
      (onChange as (value: string[]) => void)?.([]);
    } else {
      (onChange as (value: string | null) => void)?.(null);
    }
  };

  const isSelected = (optionValue: string) => {
    if (multiple) {
      return ((value as string[]) || []).includes(optionValue);
    }
    return value === optionValue;
  };

  const hasValue = multiple
    ? ((value as string[]) || []).length > 0
    : value !== null && value !== undefined && value !== '';

  return (
    <Popover
      open={readOnly ? false : open}
      onOpenChange={readOnly ? undefined : setOpen}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-readonly={readOnly}
          className={cn(
            'w-full justify-between font-normal h-auto min-h-10 py-2',
            !hasValue && 'text-muted-foreground',
            readOnly && 'pointer-events-none bg-muted/50',
            className
          )}
          disabled={disabled}
        >
          <span className="flex-1 text-left flex flex-wrap gap-1.5 items-center">
            {multiple ? (
              selectedOptions.length > 0 ? (
                <>
                  {selectedOptions.slice(0, 3).map((opt) => (
                    <Badge
                      key={opt.value}
                      variant="secondary"
                      className="text-xs px-2 py-0.5 gap-1"
                    >
                      <span className="max-w-30 truncate">{opt.label}</span>
                      {!readOnly && (
                        <span
                          role="button"
                          tabIndex={0}
                          className="ml-0.5 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-muted-foreground/20 cursor-pointer"
                          onClick={(e) => handleRemove(opt.value, e)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ')
                              handleRemove(
                                opt.value,
                                e as unknown as React.MouseEvent
                              );
                          }}
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove {opt.label}</span>
                        </span>
                      )}
                    </Badge>
                  ))}
                  {selectedOptions.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{selectedOptions.length - 3} more
                    </Badge>
                  )}
                </>
              ) : (
                placeholder
              )
            ) : selectedOptions.length > 0 ? (
              selectedOptions[0].label
            ) : (
              placeholder
            )}
          </span>
          {!readOnly && (
            <div className="flex items-center gap-1 ml-2 shrink-0">
              {hasValue && (
                <span
                  role="button"
                  tabIndex={0}
                  className="rounded-full p-0.5 hover:bg-muted cursor-pointer"
                  onClick={handleClear}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ')
                      handleClear(e as unknown as React.MouseEvent);
                  }}
                >
                  <X className="h-4 w-4 opacity-50" />
                  <span className="sr-only">Clear selection</span>
                </span>
              )}
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-(--radix-popover-trigger-width) p-0"
        align="start"
      >
        <Command shouldFilter={!onSearch}>
          <CommandInput
            placeholder={searchPlaceholder}
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList className="max-h-none overflow-hidden">
            <ScrollArea className="max-h-72">
              {isLoading && (
                <CommandLoading>
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {loadingText}
                  </div>
                </CommandLoading>
              )}
              {!isLoading && displayOptions.length === 0 && (
                <CommandEmpty>
                  {minSearchLength > 0 && searchQuery.length < minSearchLength
                    ? `Type at least ${minSearchLength} characters to search...`
                    : emptyText}
                </CommandEmpty>
              )}
              {!isLoading && displayOptions.length > 0 && (
                <CommandGroup>
                  {displayOptions.map((option) => (
                    <CommandItem
                      key={option.value}
                      // Use label for filtering (when shouldFilter is true), but we identify by value in onSelect
                      value={option.label}
                      onSelect={() => handleSelect(option)}
                      disabled={option.disabled}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          isSelected(option.value) ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
