import * as React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { cn } from '@/lib/utils';

function Switch({
    className,
    ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
    return (
        <SwitchPrimitive.Root
            data-slot="switch"
            className={cn(
                'peer focus-visible:border-ring focus-visible:ring-ring/50 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
                // Light mode styles
                'border-gray-300 data-[state=checked]:bg-gray-900 data-[state=unchecked]:bg-gray-200',
                // Dark mode styles
                'dark:border-gray-600 dark:data-[state=checked]:bg-gray-100 dark:data-[state=unchecked]:bg-gray-700',
                className,
            )}
            {...props}
        >
            <SwitchPrimitive.Thumb
                data-slot="switch-thumb"
                className={cn(
                    'pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0',
                    // Light mode thumb styles
                    'bg-white data-[state=checked]:bg-white data-[state=unchecked]:bg-white',
                    // Dark mode thumb styles
                    'dark:bg-gray-900 dark:data-[state=checked]:bg-gray-900 dark:data-[state=unchecked]:bg-gray-300',
                )}
            />
        </SwitchPrimitive.Root>
    );
}

export { Switch };
