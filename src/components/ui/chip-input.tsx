import React, { useState, useRef, forwardRef } from 'react';
import { X } from 'lucide-react';

// Utility function for className merging (cn)
const cn = (...classes: (string | undefined | null | boolean)[]): string =>
  classes.filter(Boolean).join(' ');

// Badge component types
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  children: React.ReactNode;
}

const Badge = ({
  variant = 'secondary',
  className,
  children,
  ...props
}: BadgeProps) => {
  const variants = {
    default: 'bg-gray-900 text-white hover:bg-gray-800',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    destructive: 'bg-red-500 text-white hover:bg-red-600',
    outline: 'border border-gray-300 bg-transparent hover:bg-gray-50',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
};

// ChipInput component types
export interface ChipInputProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'onChange' | 'defaultValue'
  > {
  value?: string[] | string | null;
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  splitters?: string[];
  disabled?: boolean;
  maxChips?: number;
  allowDuplicates?: boolean;
  chipVariant?: BadgeProps['variant'];
  inputClassName?: string;
  chipClassName?: string;
  renderChip?: (
    chip: string,
    index: number,
    handleRemove: (index: number) => void,
  ) => React.ReactNode;
  beforeAdd?: (chip: string) => string | boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  validate?: (chip: string) => boolean;
  name?: string;
  error?: string | boolean;
}

// Simplified ChipInput component for form library integration
const ChipInput = forwardRef<HTMLDivElement, ChipInputProps>(
  (
    {
      value: valueProp,
      defaultValue = [],
      onChange,
      onBlur,
      placeholder = 'Type and press space to add...',
      splitters = [' ', ',', 'Enter'],
      className,
      disabled = false,
      maxChips,
      allowDuplicates = false,
      chipVariant = 'secondary',
      inputClassName,
      chipClassName,
      renderChip,
      beforeAdd,
      leftIcon,
      rightIcon,
      validate = () => true,
      name,
      error,
      ...props
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = useState<string[]>(defaultValue);
    const [inputValue, setInputValue] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null);

    // Handle both string and array values for form library compatibility
    const normalizeValue = (
      val: string[] | string | null | undefined,
    ): string[] => {
      if (typeof val === 'string') {
        return val
          ? val
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
          : [];
      }
      return Array.isArray(val) ? val : [];
    };

    // Determine if component is controlled
    const isControlled = valueProp !== undefined;
    const value = isControlled ? normalizeValue(valueProp) : internalValue;

    const updateValue = (newValue: string[]): void => {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      // Call onChange with array for form libraries
      onChange?.(newValue);
    };

    const addChip = (chipValue: string): void => {
      let processedValue = chipValue.trim();
      if (!processedValue) return;

      // Apply beforeAdd transformation if provided
      if (beforeAdd) {
        const result = beforeAdd(processedValue);
        if (typeof result === 'boolean' && !result) return;
        if (typeof result === 'string') processedValue = result;
      }

      // Validate the chip
      if (!validate(processedValue)) return;

      if (maxChips && value.length >= maxChips) return;
      if (!allowDuplicates && value.includes(processedValue)) return;

      const newValue = [...value, processedValue];
      updateValue(newValue);
      setInputValue('');
    };

    const removeChip = (index: number): void => {
      const newValue = value.filter((_, i) => i !== index);
      updateValue(newValue);
    };

    const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement>,
    ): void => {
      const inputVal = e.target.value;

      // Check if any splitter is present
      const splitterFound = splitters.find(
        (splitter) => splitter !== 'Enter' && inputVal.includes(splitter),
      );

      if (splitterFound) {
        const parts = inputVal.split(splitterFound);
        const chipValue = parts[0];
        const remaining = parts.slice(1).join(splitterFound);

        if (chipValue.trim()) {
          addChip(chipValue);
        }
        setInputValue(remaining);
      } else {
        setInputValue(inputVal);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
      if (splitters.includes(e.key)) {
        e.preventDefault();
        addChip(inputValue);
      } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
        removeChip(value.length - 1);
      }
    };

    const handleContainerClick = (): void => {
      inputRef.current?.focus();
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>): void => {
      // Add chip when input loses focus if there's content
      if (inputValue.trim()) {
        addChip(inputValue);
      }
      // Call external onBlur for form validation
      onBlur?.(e);
    };

    return (
      <div className="w-full">
        <div
          ref={ref}
          className={cn(
            'flex min-h-10 w-full flex-wrap items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors',
            'border-gray-300 bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20',
            disabled && 'cursor-not-allowed bg-gray-50 opacity-50',
            error &&
              'border-red-500 focus-within:border-red-500 focus-within:ring-red-500/20',
            className,
          )}
          onClick={handleContainerClick}
          {...props}
        >
          {leftIcon && <span className="mr-2 text-gray-400">{leftIcon}</span>}

          {value.map((chip, index) =>
            renderChip ? (
              <React.Fragment key={`${chip}-${index}`}>
                {renderChip(chip, index, removeChip)}
              </React.Fragment>
            ) : (
              <Badge
                key={`${chip}-${index}`}
                variant={chipVariant}
                className={cn(
                  'flex items-center gap-1 px-2 py-1 text-xs',
                  chipClassName,
                )}
              >
                {chip}
                {!disabled && (
                  <button
                    type="button"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation();
                      removeChip(index);
                    }}
                    className="ml-1 transition-colors hover:text-red-500 focus:outline-none"
                    aria-label={`Remove ${chip}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </Badge>
            ),
          )}

          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            disabled={disabled}
            placeholder={value.length === 0 ? placeholder : ''}
            className={cn(
              'min-w-[120px] flex-1 bg-transparent outline-none placeholder:text-gray-400 disabled:cursor-not-allowed',
              inputClassName,
            )}
            name={name}
          />

          {rightIcon && <span className="ml-2 text-gray-400">{rightIcon}</span>}
        </div>
      </div>
    );
  },
);

ChipInput.displayName = 'ChipInput';

export { ChipInput };
