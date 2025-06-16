'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface IconInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    onRightIconClick?: () => void;
    onLeftIconClick?: () => void;
}

const IconInput = React.forwardRef<HTMLInputElement, IconInputProps>(
    (
        {
            className,
            type,
            leftIcon,
            rightIcon,
            onLeftIconClick,
            onRightIconClick,
            ...props
        },
        ref,
    ) => {
        return (
            <div className="relative">
                {leftIcon && (
                    <div
                        className={cn(
                            'absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400',
                            onLeftIconClick &&
                                'cursor-pointer hover:text-gray-600',
                        )}
                        onClick={onLeftIconClick}
                    >
                        {leftIcon}
                    </div>
                )}
                <input
                    type={type}
                    className={cn(
                        'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
                        leftIcon && 'pl-10',
                        rightIcon && 'pr-10',
                        className,
                    )}
                    ref={ref}
                    {...props}
                />
                {rightIcon && (
                    <div
                        className={cn(
                            'absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400',
                            onRightIconClick &&
                                'cursor-pointer hover:text-gray-600',
                        )}
                        onClick={onRightIconClick}
                    >
                        {rightIcon}
                    </div>
                )}
            </div>
        );
    },
);
IconInput.displayName = 'IconInput';

export { IconInput };
