'use client';

import * as React from 'react';
import { Check, ChevronDown, Search, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

export interface MultiSelectOption {
    label: string;
    value: string;
    disabled?: boolean;
}

export interface MultiSelectProps {
    options: MultiSelectOption[];
    value?: string | string[];
    onChange?: (value: string | string[]) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyText?: string;
    className?: string;
    disabled?: boolean;
    maxSelected?: number;
    showSearch?: boolean;
    showSelectAll?: boolean;
    chipVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
    // New props for enhanced functionality
    mode?: 'single' | 'multiple';
    onSearch?: (
        query: string,
    ) => Promise<MultiSelectOption[]> | MultiSelectOption[];
    searchDebounceMs?: number;
    loading?: boolean;
    loadingText?: string;
}

const MultiSelect = React.forwardRef<HTMLButtonElement, MultiSelectProps>(
    (
        {
            options: initialOptions,
            value = [],
            onChange,
            placeholder = 'Select items...',
            searchPlaceholder = 'Search...',
            emptyText = 'No items found',
            className,
            disabled = false,
            maxSelected,
            showSearch = true,
            showSelectAll = true,
            chipVariant = 'secondary',
            mode = 'multiple',
            onSearch,
            searchDebounceMs = 300,
            loading = false,
            loadingText = 'Loading...',
            ...props
        },
        ref,
    ) => {
        const [open, setOpen] = React.useState(false);
        const [searchValue, setSearchValue] = React.useState('');
        const [options, setOptions] =
            React.useState<MultiSelectOption[]>(initialOptions);
        const [isSearching, setIsSearching] = React.useState(false);
        const searchTimeoutRef = React.useRef<NodeJS.Timeout>(null!);

        // Normalize value to always be an array internally
        const normalizedValue = React.useMemo(() => {
            if (mode === 'single') {
                return typeof value === 'string'
                    ? [value]
                    : value.length > 0
                      ? [value[0]]
                      : [];
            }
            return Array.isArray(value)
                ? value
                : typeof value === 'string'
                  ? [value]
                  : [];
        }, [value, mode]);

        const selectedOptions = options.filter((option) =>
            normalizedValue.includes(option.value),
        );

        const filteredOptions = React.useMemo(() => {
            if (onSearch) {
                // When using remote search, return options as-is since filtering is handled remotely
                return options;
            }
            // Local filtering
            return options.filter((option) =>
                option.label.toLowerCase().includes(searchValue.toLowerCase()),
            );
        }, [options, searchValue, onSearch]);

        // Handle remote search with debouncing
        React.useEffect(() => {
            if (!onSearch || !searchValue) {
                if (!searchValue && onSearch) {
                    // Reset to initial options when search is cleared
                    setOptions(initialOptions);
                }
                return;
            }

            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }

            searchTimeoutRef.current = setTimeout(async () => {
                setIsSearching(true);
                try {
                    const result = await onSearch(searchValue);
                    setOptions(Array.isArray(result) ? result : []);
                } catch (error) {
                    console.error('Search error:', error);
                    setOptions([]);
                } finally {
                    setIsSearching(false);
                }
            }, searchDebounceMs);

            return () => {
                if (searchTimeoutRef.current) {
                    clearTimeout(searchTimeoutRef.current);
                }
            };
        }, [searchValue, onSearch, searchDebounceMs, initialOptions]);

        // Update options when initialOptions change
        React.useEffect(() => {
            if (!onSearch || !searchValue) {
                setOptions(initialOptions);
            }
        }, [initialOptions, onSearch, searchValue]);

        const handleSelect = (optionValue: string) => {
            if (mode === 'single') {
                const newValue = normalizedValue.includes(optionValue)
                    ? ''
                    : optionValue;
                onChange?.(newValue);
                setOpen(false); // Close dropdown after single selection
            } else {
                const newValue = normalizedValue.includes(optionValue)
                    ? normalizedValue.filter((v) => v !== optionValue)
                    : maxSelected && normalizedValue.length >= maxSelected
                      ? normalizedValue
                      : [...normalizedValue, optionValue];

                onChange?.(newValue);
            }
        };

        const handleSelectAll = () => {
            if (mode === 'single') return; // Not applicable for single select

            const allValues = filteredOptions.map((option) => option.value);
            const newValue =
                normalizedValue.length === filteredOptions.length
                    ? []
                    : allValues;
            onChange?.(newValue);
        };

        const handleRemoveChip = (optionValue: string) => {
            if (mode === 'single') {
                onChange?.('');
            } else {
                const newValue = normalizedValue.filter(
                    (v) => v !== optionValue,
                );
                onChange?.(newValue);
            }
        };

        const handleClearAll = () => {
            onChange?.(mode === 'single' ? '' : []);
        };

        const displayText = React.useMemo(() => {
            if (selectedOptions.length === 0) {
                return placeholder;
            }

            if (mode === 'single') {
                return selectedOptions[0]?.label || '';
            }

            return `${selectedOptions.length} selected`;
        }, [selectedOptions, placeholder, mode]);

        return (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        ref={ref}
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn(
                            'h-auto min-h-10 w-full justify-between p-2',
                            disabled && 'cursor-not-allowed opacity-50',
                            className,
                        )}
                        disabled={disabled}
                        {...props}
                    >
                        <div className="flex flex-1 flex-wrap items-center gap-1">
                            {mode === 'single' ? (
                                <span
                                    className={cn(
                                        selectedOptions.length === 0 &&
                                            'text-muted-foreground',
                                    )}
                                >
                                    {displayText}
                                </span>
                            ) : selectedOptions.length === 0 ? (
                                <span className="text-muted-foreground">
                                    {placeholder}
                                </span>
                            ) : (
                                selectedOptions.map((option) => (
                                    <Badge
                                        key={option.value}
                                        variant={chipVariant}
                                        className="flex items-center gap-1 px-2 py-1 text-xs"
                                    >
                                        {option.label}
                                        <X
                                            className="hover:text-destructive h-3 w-3 cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveChip(option.value);
                                            }}
                                        />
                                    </Badge>
                                ))
                            )}
                        </div>
                        <div className="ml-2 flex items-center gap-1">
                            {selectedOptions.length > 0 && (
                                <X
                                    className="hover:text-destructive h-4 w-4 cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleClearAll();
                                    }}
                                />
                            )}
                            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                        </div>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                    <Command shouldFilter={!onSearch}>
                        {showSearch && (
                            <div className="flex items-center border-b px-3">
                                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                                <CommandInput
                                    placeholder={searchPlaceholder}
                                    value={searchValue}
                                    onValueChange={setSearchValue}
                                    className="placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                />
                                {(isSearching || loading) && (
                                    <Loader2 className="ml-2 h-4 w-4 shrink-0 animate-spin" />
                                )}
                            </div>
                        )}
                        <CommandList>
                            <CommandEmpty>
                                {isSearching || loading
                                    ? loadingText
                                    : emptyText}
                            </CommandEmpty>
                            <CommandGroup>
                                {showSelectAll &&
                                    mode === 'multiple' &&
                                    filteredOptions.length > 0 &&
                                    !isSearching &&
                                    !loading && (
                                        <CommandItem
                                            onSelect={handleSelectAll}
                                            className="cursor-pointer"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <div
                                                    className={cn(
                                                        'border-primary flex h-4 w-4 items-center justify-center rounded-sm border',
                                                        normalizedValue.length ===
                                                            filteredOptions.length
                                                            ? 'bg-primary text-primary-foreground'
                                                            : 'opacity-50 [&_svg]:invisible',
                                                    )}
                                                >
                                                    <Check className="h-3 w-3" />
                                                </div>
                                                <span className="font-medium">
                                                    Select All
                                                </span>
                                            </div>
                                        </CommandItem>
                                    )}
                                {!isSearching &&
                                    !loading &&
                                    filteredOptions.map((option) => (
                                        <CommandItem
                                            key={option.value}
                                            onSelect={() =>
                                                handleSelect(option.value)
                                            }
                                            disabled={option.disabled}
                                            className="cursor-pointer"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <div
                                                    className={cn(
                                                        'border-primary flex h-4 w-4 items-center justify-center rounded-sm border',
                                                        normalizedValue.includes(
                                                            option.value,
                                                        )
                                                            ? 'bg-primary text-primary-foreground'
                                                            : 'opacity-50 [&_svg]:invisible',
                                                    )}
                                                >
                                                    <Check className="h-3 w-3" />
                                                </div>
                                                <span>{option.label}</span>
                                            </div>
                                        </CommandItem>
                                    ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        );
    },
);
MultiSelect.displayName = 'MultiSelect';

export { MultiSelect };
