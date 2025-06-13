import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Check, Clock } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { StepperValidationStatus } from '../ui/stepper';

// Animation variants
const stepCircleVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.1 },
    tap: { scale: 0.95 },
    active: { scale: 1.15 },
    completed: { scale: 1, rotate: 360 },
};

const progressBarVariants = {
    initial: { width: '0%' },
    animate: (width: string) => ({
        width,
        transition: { duration: 0.8, ease: 'easeInOut' },
    }),
};

const validationDotVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0, opacity: 0 },
    pulse: {
        scale: [1, 1.2, 1],
        transition: { duration: 1.5, repeat: Number.POSITIVE_INFINITY },
    },
};

const iconVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: { scale: 1, rotate: 0 },
    exit: { scale: 0, rotate: 180 },
};

// StepperHeader component props
interface StepperHeaderProps {
    steps: Array<{
        key: string;
        label: string;
        description?: string;
        Icon?: React.ComponentType<{ className?: string }>;
    }>;
    activeStep: number;
    completedSteps: Set<number>;
    onStepClick?: (stepIndex: number) => void;
    canGoToStep?: (stepIndex: number) => boolean;
    stepValidationStatus: Record<string, StepperValidationStatus>;
    stepErrors: Record<string, string[]>;
    minimal?: boolean;
}

export function StepperHeader({
    steps,
    activeStep,
    completedSteps,
    onStepClick,
    canGoToStep,
    stepValidationStatus,
    stepErrors,
    minimal = false,
}: StepperHeaderProps) {
    const handleStepClick = (stepIndex: number) => {
        if (onStepClick && canGoToStep?.(stepIndex)) {
            onStepClick(stepIndex);
        }
    };

    const getValidationIcon = (stepKey: string, index: number) => {
        const status = stepValidationStatus[stepKey];
        const isCompleted = completedSteps.has(index);

        if (isCompleted) {
            return (
                <motion.div
                    key="completed"
                    variants={iconVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                >
                    <Check className="h-3 w-3 md:h-4 md:w-4" />
                </motion.div>
            );
        }

        switch (status) {
            case 'valid':
                return (
                    <motion.div
                        key="valid"
                        variants={iconVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                    >
                        <Check className="h-3 w-3 text-green-500 md:h-4 md:w-4" />
                    </motion.div>
                );
            case 'invalid':
                return (
                    <motion.div
                        key="invalid"
                        variants={iconVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                    >
                        <AlertCircle className="h-3 w-3 text-red-500 md:h-4 md:w-4" />
                    </motion.div>
                );
            case 'partial':
                return (
                    <motion.div
                        key="partial"
                        variants={iconVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                    >
                        <Clock className="h-3 w-3 text-yellow-500 md:h-4 md:w-4" />
                    </motion.div>
                );
            default:
                return (
                    <motion.span
                        key="number"
                        variants={iconVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="text-xs md:text-sm"
                    >
                        {index + 1}
                    </motion.span>
                );
        }
    };

    const getStepStatusColor = (stepKey: string, index: number) => {
        const status = stepValidationStatus[stepKey];
        const isCompleted = completedSteps.has(index);
        const isActive = index === activeStep;

        if (isCompleted) {
            return 'bg-purple-600 border-purple-600 text-white';
        }

        if (isActive) {
            switch (status) {
                case 'valid':
                    return 'border-green-500 text-green-600 bg-green-50';
                case 'invalid':
                    return 'border-red-500 text-red-600 bg-red-50';
                case 'partial':
                    return 'border-yellow-500 text-yellow-600 bg-yellow-50';
                default:
                    return 'border-purple-600 text-purple-600 bg-purple-50';
            }
        }

        switch (status) {
            case 'valid':
                return 'border-green-300 text-green-600 bg-green-50';
            case 'invalid':
                return 'border-red-300 text-red-500 bg-red-50';
            case 'partial':
                return 'border-yellow-300 text-yellow-500 bg-yellow-50';
            default:
                return 'border-gray-300 text-gray-500 bg-white';
        }
    };

    const getTooltipContent = (step: any, index: number) => {
        const status = stepValidationStatus[step.key];
        const errors = stepErrors[step.key] || [];
        const isCompleted = completedSteps.has(index);

        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-xs text-center"
            >
                <div className="font-medium">{step.label}</div>
                {step.description && (
                    <div className="mt-1 text-xs text-gray-400">
                        {step.description}
                    </div>
                )}

                {/* Validation Status */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="mt-2 text-xs"
                >
                    {isCompleted && (
                        <div className="text-green-400">✓ Completed</div>
                    )}
                    {!isCompleted && status === 'valid' && (
                        <div className="text-green-400">✓ Valid</div>
                    )}
                    {!isCompleted && status === 'invalid' && (
                        <div className="text-red-400">
                            ⚠ {errors.length} error
                            {errors.length !== 1 ? 's' : ''}
                        </div>
                    )}
                    {!isCompleted && status === 'partial' && (
                        <div className="text-yellow-400">⏳ In progress</div>
                    )}
                    {!isCompleted && status === 'untouched' && (
                        <div className="text-gray-400">○ Not started</div>
                    )}
                </motion.div>

                {/* Error Details */}
                {errors.length > 0 && !isCompleted && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ delay: 0.2 }}
                        className="mt-2 text-left text-xs text-red-300"
                    >
                        {errors.slice(0, 3).map((error, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + i * 0.1 }}
                            >
                                • {error}
                            </motion.div>
                        ))}
                        {errors.length > 3 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                            >
                                • +{errors.length - 3} more...
                            </motion.div>
                        )}
                    </motion.div>
                )}

                {canGoToStep?.(index) && onStepClick && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mt-2 text-xs text-blue-400"
                    >
                        Click to navigate
                    </motion.div>
                )}
            </motion.div>
        );
    };

    return (
        <TooltipProvider>
            <div className="w-full py-6">
                {/* Step Counter - Mobile and Desktop */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn('text-center', minimal ? 'mb-3' : 'mb-6')}
                >
                    <motion.div
                        key={`step-${activeStep}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className={cn(
                            'font-medium text-gray-500',
                            minimal ? 'text-xs' : 'text-sm',
                        )}
                    >
                        Step {activeStep + 1} of {steps.length}
                    </motion.div>
                    {!minimal && (
                        <motion.div
                            key={`label-${activeStep}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            className="mt-1 text-xs text-gray-400"
                        >
                            {steps[activeStep]?.label}
                        </motion.div>
                    )}
                </motion.div>

                {/* Mobile View - Horizontal Compact Layout */}
                <div className="md:hidden">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 flex items-center justify-center space-x-2"
                    >
                        {steps.map((step, index) => {
                            const isActive = index === activeStep;
                            const isCompleted = completedSteps.has(index);
                            const isClickable =
                                canGoToStep?.(index) && onStepClick;

                            return (
                                <Tooltip key={step.key}>
                                    <TooltipTrigger asChild>
                                        <div className="relative">
                                            <motion.button
                                                onClick={() =>
                                                    handleStepClick(index)
                                                }
                                                disabled={!isClickable}
                                                className={cn(
                                                    'flex items-center justify-center rounded-full border-2 text-xs font-medium transition-colors duration-300',
                                                    minimal
                                                        ? 'h-6 w-6'
                                                        : 'h-8 w-8',
                                                    getStepStatusColor(
                                                        step.key,
                                                        index,
                                                    ),
                                                    !isClickable &&
                                                        'cursor-not-allowed',
                                                )}
                                                variants={stepCircleVariants}
                                                initial="initial"
                                                animate={
                                                    isActive
                                                        ? 'active'
                                                        : 'initial'
                                                }
                                                whileHover={
                                                    isClickable
                                                        ? 'hover'
                                                        : 'initial'
                                                }
                                                whileTap={
                                                    isClickable
                                                        ? 'tap'
                                                        : 'initial'
                                                }
                                                transition={{ duration: 0.2 }}
                                            >
                                                <AnimatePresence mode="wait">
                                                    {getValidationIcon(
                                                        step.key,
                                                        index,
                                                    )}
                                                </AnimatePresence>
                                            </motion.button>

                                            {/* Validation indicator dot */}
                                            <AnimatePresence>
                                                {!isCompleted &&
                                                    stepValidationStatus[
                                                        step.key
                                                    ] === 'invalid' && (
                                                        <motion.div
                                                            variants={
                                                                validationDotVariants
                                                            }
                                                            initial="initial"
                                                            animate={[
                                                                'animate',
                                                                'pulse',
                                                            ]}
                                                            exit="exit"
                                                            className={cn(
                                                                'absolute -top-1 -right-1 rounded-full border-2 border-white bg-red-500',
                                                                minimal
                                                                    ? 'h-2 w-2'
                                                                    : 'h-3 w-3',
                                                            )}
                                                        />
                                                    )}
                                                {!isCompleted &&
                                                    stepValidationStatus[
                                                        step.key
                                                    ] === 'valid' && (
                                                        <motion.div
                                                            variants={
                                                                validationDotVariants
                                                            }
                                                            initial="initial"
                                                            animate="animate"
                                                            exit="exit"
                                                            className={cn(
                                                                'absolute -top-1 -right-1 rounded-full border-2 border-white bg-green-500',
                                                                minimal
                                                                    ? 'h-2 w-2'
                                                                    : 'h-3 w-3',
                                                            )}
                                                        />
                                                    )}
                                            </AnimatePresence>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {getTooltipContent(step, index)}
                                    </TooltipContent>
                                </Tooltip>
                            );
                        })}
                    </motion.div>

                    {/* Mobile Progress Bar */}
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                        <motion.div
                            className="h-full bg-purple-600"
                            variants={progressBarVariants}
                            initial="initial"
                            animate="animate"
                            custom={`${((activeStep + (completedSteps.has(activeStep) ? 1 : 0)) / steps.length) * 100}%`}
                        />
                    </div>
                </div>

                {/* Desktop View - Horizontal Layout */}
                <div className="hidden md:block">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between"
                    >
                        {steps.map((step, index) => {
                            const isActive = index === activeStep;
                            const isCompleted = completedSteps.has(index);
                            const isClickable =
                                canGoToStep?.(index) && onStepClick;
                            const Icon = step.Icon;

                            return (
                                <React.Fragment key={step.key}>
                                    {/* Step Container */}
                                    <div className="flex min-w-0 flex-1 flex-col items-center">
                                        {/* Step Circle */}
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className="relative">
                                                    <motion.button
                                                        onClick={() =>
                                                            handleStepClick(
                                                                index,
                                                            )
                                                        }
                                                        disabled={!isClickable}
                                                        className={cn(
                                                            'mb-3 flex items-center justify-center rounded-full border-2 text-sm font-medium transition-colors duration-300',
                                                            minimal
                                                                ? 'h-8 w-8'
                                                                : 'h-12 w-12', // Smaller size in minimal mode
                                                            getStepStatusColor(
                                                                step.key,
                                                                index,
                                                            ),
                                                            !isClickable &&
                                                                'cursor-not-allowed',
                                                        )}
                                                        variants={
                                                            stepCircleVariants
                                                        }
                                                        initial="initial"
                                                        animate={
                                                            isActive
                                                                ? 'active'
                                                                : isCompleted
                                                                  ? 'completed'
                                                                  : 'initial'
                                                        }
                                                        whileHover={
                                                            isClickable
                                                                ? 'hover'
                                                                : 'initial'
                                                        }
                                                        whileTap={
                                                            isClickable
                                                                ? 'tap'
                                                                : 'initial'
                                                        }
                                                        transition={{
                                                            duration: 0.3,
                                                        }}
                                                    >
                                                        <AnimatePresence mode="wait">
                                                            {isCompleted ? (
                                                                <motion.div
                                                                    key="completed"
                                                                    variants={
                                                                        iconVariants
                                                                    }
                                                                    initial="initial"
                                                                    animate="animate"
                                                                    exit="exit"
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            minimal
                                                                                ? 'h-4 w-4'
                                                                                : 'h-5 w-5',
                                                                        )}
                                                                    />
                                                                </motion.div>
                                                            ) : stepValidationStatus[
                                                                  step.key
                                                              ] ===
                                                              'invalid' ? (
                                                                <motion.div
                                                                    key="invalid"
                                                                    variants={
                                                                        iconVariants
                                                                    }
                                                                    initial="initial"
                                                                    animate="animate"
                                                                    exit="exit"
                                                                >
                                                                    <AlertCircle
                                                                        className={cn(
                                                                            minimal
                                                                                ? 'h-4 w-4'
                                                                                : 'h-5 w-5',
                                                                        )}
                                                                    />
                                                                </motion.div>
                                                            ) : stepValidationStatus[
                                                                  step.key
                                                              ] === 'valid' ? (
                                                                <motion.div
                                                                    key="valid"
                                                                    variants={
                                                                        iconVariants
                                                                    }
                                                                    initial="initial"
                                                                    animate="animate"
                                                                    exit="exit"
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            minimal
                                                                                ? 'h-4 w-4'
                                                                                : 'h-5 w-5',
                                                                        )}
                                                                    />
                                                                </motion.div>
                                                            ) : stepValidationStatus[
                                                                  step.key
                                                              ] ===
                                                              'partial' ? (
                                                                <motion.div
                                                                    key="partial"
                                                                    variants={
                                                                        iconVariants
                                                                    }
                                                                    initial="initial"
                                                                    animate="animate"
                                                                    exit="exit"
                                                                >
                                                                    <Clock
                                                                        className={cn(
                                                                            minimal
                                                                                ? 'h-4 w-4'
                                                                                : 'h-5 w-5',
                                                                        )}
                                                                    />
                                                                </motion.div>
                                                            ) : minimal ||
                                                              !Icon ? (
                                                                <motion.span
                                                                    key="number"
                                                                    variants={
                                                                        iconVariants
                                                                    }
                                                                    initial="initial"
                                                                    animate="animate"
                                                                    exit="exit"
                                                                    className={cn(
                                                                        minimal
                                                                            ? 'text-xs'
                                                                            : 'text-sm',
                                                                    )}
                                                                >
                                                                    {index + 1}
                                                                </motion.span>
                                                            ) : (
                                                                <motion.div
                                                                    key="icon"
                                                                    variants={
                                                                        iconVariants
                                                                    }
                                                                    initial="initial"
                                                                    animate="animate"
                                                                    exit="exit"
                                                                >
                                                                    <Icon className="h-5 w-5" />
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </motion.button>

                                                    {/* Validation indicator dot */}
                                                    <AnimatePresence>
                                                        {!isCompleted &&
                                                            stepValidationStatus[
                                                                step.key
                                                            ] === 'invalid' && (
                                                                <motion.div
                                                                    variants={
                                                                        validationDotVariants
                                                                    }
                                                                    initial="initial"
                                                                    animate={[
                                                                        'animate',
                                                                        'pulse',
                                                                    ]}
                                                                    exit="exit"
                                                                    className={cn(
                                                                        'absolute -top-1 -right-1 rounded-full border-2 border-white',
                                                                        minimal
                                                                            ? 'h-3 w-3'
                                                                            : 'h-4 w-4',
                                                                        'bg-red-500',
                                                                    )}
                                                                />
                                                            )}
                                                        {!isCompleted &&
                                                            stepValidationStatus[
                                                                step.key
                                                            ] === 'valid' && (
                                                                <motion.div
                                                                    variants={
                                                                        validationDotVariants
                                                                    }
                                                                    initial="initial"
                                                                    animate="animate"
                                                                    exit="exit"
                                                                    className={cn(
                                                                        'absolute -top-1 -right-1 rounded-full border-2 border-white',
                                                                        minimal
                                                                            ? 'h-3 w-3'
                                                                            : 'h-4 w-4',
                                                                        'bg-green-500',
                                                                    )}
                                                                />
                                                            )}
                                                    </AnimatePresence>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                {getTooltipContent(step, index)}
                                            </TooltipContent>
                                        </Tooltip>

                                        {/* Step Label */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className={cn(
                                                'text-center',
                                                minimal
                                                    ? 'max-w-16'
                                                    : 'max-w-32',
                                            )}
                                        >
                                            <motion.h3
                                                className={cn(
                                                    'mb-1 transition-colors duration-300',
                                                    minimal
                                                        ? 'text-xs'
                                                        : 'text-sm',
                                                    'font-medium',
                                                    isActive &&
                                                        'text-purple-600',
                                                    isCompleted &&
                                                        'text-gray-900',
                                                    !isActive &&
                                                        !isCompleted &&
                                                        stepValidationStatus[
                                                            step.key
                                                        ] === 'invalid' &&
                                                        'text-red-500',
                                                    !isActive &&
                                                        !isCompleted &&
                                                        stepValidationStatus[
                                                            step.key
                                                        ] === 'valid' &&
                                                        'text-green-600',
                                                    !isActive &&
                                                        !isCompleted &&
                                                        stepValidationStatus[
                                                            step.key
                                                        ] === 'partial' &&
                                                        'text-yellow-600',
                                                    !isActive &&
                                                        !isCompleted &&
                                                        stepValidationStatus[
                                                            step.key
                                                        ] === 'untouched' &&
                                                        'text-gray-500',
                                                )}
                                                animate={{
                                                    scale: isActive ? 1.05 : 1,
                                                }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                {step.label}
                                            </motion.h3>
                                            {!minimal && step.description && (
                                                <motion.p
                                                    className={cn(
                                                        'text-xs transition-colors duration-300',
                                                        isActive &&
                                                            'text-purple-500',
                                                        isCompleted &&
                                                            'text-gray-600',
                                                        !isActive &&
                                                            !isCompleted &&
                                                            'text-gray-400',
                                                    )}
                                                    animate={{
                                                        opacity: isActive
                                                            ? 1
                                                            : 0.8,
                                                    }}
                                                >
                                                    {step.description}
                                                </motion.p>
                                            )}
                                        </motion.div>
                                    </div>

                                    {/* Progress Line */}
                                    {index < steps.length - 1 && (
                                        <div
                                            className={cn(
                                                'mb-8 flex items-center justify-center',
                                                minimal ? '-mx-1' : '-mx-2',
                                            )}
                                        >
                                            <motion.div
                                                className={cn(
                                                    'h-0.5 transition-colors duration-500',
                                                    minimal
                                                        ? 'w-full min-w-12'
                                                        : 'w-full min-w-8',
                                                )}
                                                animate={{
                                                    backgroundColor: isCompleted
                                                        ? '#9333ea'
                                                        : '#e5e7eb',
                                                }}
                                                transition={{
                                                    duration: 0.5,
                                                    delay: 0.2,
                                                }}
                                            />
                                        </div>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </motion.div>

                    {/* Desktop Progress Bar */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-6 h-1 w-full overflow-hidden rounded-full bg-gray-200"
                    >
                        <motion.div
                            className="h-full bg-blue-500"
                            variants={progressBarVariants}
                            initial="initial"
                            animate="animate"
                            custom={`${((activeStep + (completedSteps.has(activeStep) ? 1 : 0)) / steps.length) * 100}%`}
                        />
                    </motion.div>
                </div>
            </div>
        </TooltipProvider>
    );
}
