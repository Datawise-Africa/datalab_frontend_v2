import type { LucideIcon } from 'lucide-react';
import React, { useMemo } from 'react';
import { useForm, type UseFormReturn, type FieldPath } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z, type ZodSchema, type ZodObject } from 'zod';
import type { StepperValidationStatus } from '@/components/ui/stepper';
// Base stepper item type with required key
type StepperItem<
    TKey extends string = string,
    TSchema extends ZodSchema<any> | undefined = undefined,
> = {
    key: TKey;
    label: string;
    description?: string;
    schema?: TSchema;
    Icon?: LucideIcon;
};

// Extract key from stepper item
type ExtractKey<T> = T extends StepperItem<infer K, any> ? K : never;

// Extract schema from stepper item
// type ExtractSchema<T> = T extends StepperItem<any, infer S> ? S : never;

// Extract all keys from steps array
type ExtractKeys<T extends readonly StepperItem<any, any>[]> = {
    [K in keyof T]: ExtractKey<T[K]>;
};

// Extract all schemas from steps array
// type ExtractSchemas<T extends readonly StepperItem<any, any>[]> = {
//     [K in keyof T]: ExtractSchema<T[K]>;
// };

// Create a mapped type from steps to construct nested object schema
type StepsToNestedSchema<T extends readonly StepperItem<any, any>[]> = {
    [K in keyof T as T[K] extends StepperItem<infer Key, any>
        ? Key
        : never]: T[K] extends StepperItem<any, infer Schema>
        ? Schema extends ZodSchema<infer U>
            ? U
            : Record<string, any>
        : Record<string, any>;
};

// Filter steps that have schemas
// type FilterStepsWithSchemas<T extends readonly StepperItem<any, any>[]> = {
//     [K in keyof T]: T[K] extends StepperItem<any, ZodSchema<any>>
//         ? T[K]
//         : never;
// }[number];

// Create the final nested form type
type GetNestedFormType<T extends readonly StepperItem<any, any>[]> =
    StepsToNestedSchema<T>;

// Get current step schema type
type GetCurrentStepSchema<
    T extends readonly StepperItem<any, any>[],
    TActiveStep extends number,
> = T[TActiveStep] extends StepperItem<any, infer S> ? S : undefined;

// Get current step key
type GetCurrentStepKey<
    T extends readonly StepperItem<any, any>[],
    TActiveStep extends number,
> = T[TActiveStep] extends StepperItem<infer K, any> ? K : string;

interface StepperActions<T extends Record<string, any>> {
    nextStep: () => Promise<boolean>;
    prevStep: () => void;
    resetSteps: () => void;
    goToStep: (step: number) => Promise<boolean>;
    validateStep: (step?: number) => Promise<boolean>;
    validateAllSteps: () => Promise<boolean>;
    validateStepByKey: (key: string) => Promise<boolean>;
    getStepData: <K extends keyof T>(key: K) => T[K] | undefined;
    setStepData: <K extends keyof T>(key: K, data: Partial<T[K]>) => void;
    isFirstStep: boolean;
    isLastStep: boolean;
    canGoToStep: (step: number) => boolean;
}

interface UseStepperReturn<
    T extends readonly StepperItem<any, any>[],
    TForm extends Record<string, any> = GetNestedFormType<T>,
> {
    activeStep: number;
    activeStepKey: GetCurrentStepKey<T, number>;
    steps: T;
    form: UseFormReturn<TForm>;
    actions: StepperActions<TForm>;
    currentStepSchema: GetCurrentStepSchema<T, number>;
    nestedSchema: ZodObject<any> | null;
    isValid: boolean;
    isCurrentStepValid: boolean;
    completedSteps: Set<number>;
    completedStepKeys: Set<string>;
    stepKeyToIndex: Map<string, number>;
    stepValidationStatus: Record<string, StepperValidationStatus>;
    stepErrors: Record<string, string[]>;
}

// Create nested schema from steps
function createNestedSchema<T extends readonly StepperItem<any, any>[]>(
    steps: T,
): ZodObject<any> | null {
    const schemaObject: Record<string, ZodSchema<any>> = {};

    steps.forEach((step) => {
        if (step.schema) {
            schemaObject[step.key] = step.schema;
        }
    });

    if (Object.keys(schemaObject).length === 0) return null;

    return z.object(schemaObject);
}

// Get field paths for a specific step in nested structure
function getStepFieldPaths<T extends Record<string, any>>(
    stepKey: string,
    schema: ZodSchema<any> | undefined,
): FieldPath<T>[] {
    if (!schema) return [];

    if (schema instanceof z.ZodObject) {
        return Object.keys(schema.shape).map(
            (field) => `${stepKey}.${field}` as FieldPath<T>,
        );
    }

    // For non-object schemas, return the step key itself
    return [stepKey as FieldPath<T>];
}

// Get step index by key
function createStepKeyMap<T extends readonly StepperItem<any, any>[]>(
    steps: T,
): Map<string, number> {
    const map = new Map<string, number>();
    steps.forEach((step, index) => {
        map.set(step.key, index);
    });
    return map;
}

export function useStepper<const T extends readonly StepperItem<any, any>[]>(
    steps: T,
): UseStepperReturn<T> {
    const [activeStep, setActiveStep] = React.useState(0);
    const [completedSteps, setCompletedSteps] = React.useState<Set<number>>(
        new Set(),
    );
    const [completedStepKeys, setCompletedStepKeys] = React.useState<
        Set<string>
    >(new Set());

    const isFirstStep = activeStep === 0;
    const isLastStep = activeStep === steps.length - 1;
    const activeStepKey = steps[activeStep]?.key || '';

    const nestedSchema = React.useMemo(
        () => createNestedSchema(steps),
        [steps],
    );
    const currentStepSchema = steps[activeStep]?.schema;
    const stepKeyToIndex = React.useMemo(
        () => createStepKeyMap(steps),
        [steps],
    );

    type FormType = GetNestedFormType<T>;

    // Create default values with nested structure
    const defaultValues = React.useMemo(() => {
        const defaults: Record<string, any> = {};
        steps.forEach((step) => {
            if (step.schema) {
                defaults[step.key] = {};
            }
        });
        return defaults as FormType;
    }, [steps]);

    const form = useForm<FormType>({
        //@ts-ignore
        resolver: nestedSchema ? zodResolver(nestedSchema) : undefined,
        mode: 'onChange',
        //@ts-ignore
        defaultValues: defaultValues as FormType,
    });

    const { formState, getValues, setValue } = form;

    // Get data for a specific step
    const getStepData = <K extends keyof FormType>(
        key: K,
    ): FormType[K] | undefined => {
        const values = getValues();
        return values[key];
    };
    const stepValidationStatus = useMemo(() => {
        const status: Record<string, StepperValidationStatus> = {};
        const formValues = form.getValues();
        const formErrors = form.formState.errors;

        steps.forEach((step) => {
            if (!step.schema) {
                status[step.key] = 'valid';
                return;
            }

            const stepData = formValues[step.key as keyof typeof formValues];
            const stepErrors = formErrors[step.key as keyof typeof formErrors];

            // Special handling for attachments step (optional)
            if (step.key === 'attachments') {
                status[step.key] = 'valid'; // Attachments are always valid since they're optional
                return;
            }

            // Check if step has any data
            const hasData =
                stepData &&
                Object.values(stepData as object).some(
                    (value) =>
                        value !== '' && value !== undefined && value !== null,
                );

            if (!hasData) {
                status[step.key] = 'untouched';
            } else if (stepErrors) {
                status[step.key] = 'invalid';
            } else {
                // Validate against schema
                try {
                    step.schema.parse(stepData);
                    status[step.key] = 'valid';
                } catch {
                    // Check if partially filled
                    const filledFields = Object.values(
                        stepData as object,
                    ).filter(
                        (value) =>
                            value !== '' &&
                            value !== undefined &&
                            value !== null,
                    ).length;
                    const totalFields = Object.keys(step.schema.shape).length;

                    if (filledFields > 0 && filledFields < totalFields) {
                        status[step.key] = 'partial';
                    } else {
                        status[step.key] = 'invalid';
                    }
                }
            }
        });

        return status;
    }, [form.getValues(), form.formState.errors, steps]);

    // Get step errors for tooltips
    const stepErrors = useMemo(() => {
        const errors: Record<string, string[]> = {};
        const formErrors = form.formState.errors;

        steps.forEach((step) => {
            const stepErrorObj =
                formErrors[step.key as keyof typeof formErrors];
            if (stepErrorObj && typeof stepErrorObj === 'object') {
                errors[step.key] = Object.values(stepErrorObj)
                    .filter(
                        (error) =>
                            error &&
                            typeof error === 'object' &&
                            'message' in error,
                    )
                    .map((error) => (error as { message: string }).message);
            } else {
                errors[step.key] = [];
            }
        });

        return errors;
    }, [form.formState.errors, steps]);
    // Set data for a specific step
    const setStepData = <K extends keyof FormType>(
        key: K,
        data: Partial<FormType[K]>,
    ): void => {
        const currentData = getStepData(key) || {};
        //@ts-ignore
        setValue(key, { ...currentData, ...data } as FormType[K], {
            shouldValidate: true,
            shouldDirty: true,
        });
    };

    // Validate specific step by index
    const validateStep = async (
        stepIndex: number = activeStep,
    ): Promise<boolean> => {
        const step = steps[stepIndex];
        if (!step?.schema) return true;

        const stepFieldPaths = getStepFieldPaths<FormType>(
            step.key,
            step.schema,
        );
        if (stepFieldPaths.length === 0) return true;

        return await form.trigger(stepFieldPaths);
    };

    // Validate specific step by key
    const validateStepByKey = async (key: string): Promise<boolean> => {
        const stepIndex = stepKeyToIndex.get(key);
        if (stepIndex === undefined) return false;

        return await validateStep(stepIndex);
    };

    // Validate all completed steps
    const validateAllSteps = async (): Promise<boolean> => {
        const allFieldPaths = steps
            .slice(0, activeStep + 1)
            .flatMap((step) =>
                step.schema
                    ? getStepFieldPaths<FormType>(step.key, step.schema)
                    : [],
            );

        if (allFieldPaths.length === 0) return true;
        return await form.trigger(allFieldPaths);
    };

    // Check if we can navigate to a specific step
    const canGoToStep = (targetStep: number): boolean => {
        if (targetStep < 0 || targetStep >= steps.length) return false;
        if (targetStep <= activeStep) return true; // Can always go backwards

        // Can only go forward if all intermediate steps are completed
        for (let i = activeStep; i < targetStep; i++) {
            if (!completedSteps.has(i)) return false;
        }
        return true;
    };

    const nextStep = async (): Promise<boolean> => {
        if (isLastStep) return false;

        const isCurrentStepValid = await validateStep();

        if (isCurrentStepValid) {
            setCompletedSteps((prev) => new Set(prev).add(activeStep));
            setCompletedStepKeys((prev) => new Set(prev).add(activeStepKey));
            setActiveStep((prev) => prev + 1);
            return true;
        }
        return false;
    };

    const prevStep = () => {
        if (!isFirstStep) {
            setActiveStep((prev) => prev - 1);
        }
    };

    const resetSteps = () => {
        setActiveStep(0);
        setCompletedSteps(new Set());
        setCompletedStepKeys(new Set());
        form.reset(defaultValues);
    };

    const goToStep = async (step: number): Promise<boolean> => {
        if (!canGoToStep(step)) return false;

        // If going forward, validate current step first
        if (step > activeStep) {
            const isValid = await validateStep();
            if (!isValid) return false;
            setCompletedSteps((prev) => new Set(prev).add(activeStep));
            setCompletedStepKeys((prev) => new Set(prev).add(activeStepKey));
        }

        setActiveStep(step);
        return true;
    };

    // Compute current step validity
    const isCurrentStepValid = React.useMemo(() => {
        if (!currentStepSchema) return true;

        const stepFieldPaths = getStepFieldPaths<FormType>(
            activeStepKey,
            currentStepSchema,
        );

        return stepFieldPaths.every((fieldPath) => {
            const fieldError = fieldPath
                .split('.')
                .reduce(
                    (errors, key) => errors?.[key],
                    formState.errors as any,
                );
            return !fieldError;
        });
    }, [currentStepSchema, activeStepKey, formState.errors]);

    // Compute overall form validity
    const isValid = React.useMemo(() => {
        return Object.keys(formState.errors).length === 0;
    }, [formState.errors]);

    return {
        activeStep,
        activeStepKey: activeStepKey as GetCurrentStepKey<T, number>,
        steps,
        form,
        actions: {
            nextStep,
            prevStep,
            resetSteps,
            goToStep,
            validateStep,
            validateStepByKey,
            validateAllSteps,
            getStepData,
            setStepData,
            canGoToStep,
            isFirstStep,
            isLastStep,
        },
        currentStepSchema: currentStepSchema as GetCurrentStepSchema<T, number>,

        nestedSchema,
        isValid,
        isCurrentStepValid,
        completedSteps,
        completedStepKeys,
        stepKeyToIndex,
        stepErrors,
        stepValidationStatus,
    };
}

// Enhanced helper to create type-safe steps with keys
export function createSteps<const T extends readonly StepperItem<any, any>[]>(
    steps: T,
): T {
    // Validate that all keys are unique
    const keys = steps.map((step) => step.key);
    const uniqueKeys = new Set(keys);

    if (keys.length !== uniqueKeys.size) {
        throw new Error('Stepper step keys must be unique');
    }

    return steps;
}

// Helper to create a typed stepper item with key
export function createStep<TKey extends string, TSchema extends ZodSchema<any>>(
    step: StepperItem<TKey, TSchema>,
): StepperItem<TKey, TSchema> {
    return step;
}

// Helper to create a step without schema
export function createSimpleStep<TKey extends string>(
    step: Omit<StepperItem<TKey, undefined>, 'schema'>,
): StepperItem<TKey, undefined> {
    return step;
}

// Helper type to get the nested form data type from steps
export type StepperFormData<T extends readonly StepperItem<any, any>[]> =
    GetNestedFormType<T>;

// Helper type to get a specific step's data type by key
export type StepDataByKey<
    T extends readonly StepperItem<any, any>[],
    TKey extends string,
> =
    T[number] extends StepperItem<TKey, infer Schema>
        ? Schema extends ZodSchema<infer U>
            ? U
            : Record<string, any>
        : never;

// Helper type to get all step keys
export type StepKeys<T extends readonly StepperItem<any, any>[]> =
    ExtractKeys<T>[number];

// Example usage types for better IDE support
export type {
    StepperItem,
    UseStepperReturn,
    StepperActions,
    GetNestedFormType,
    GetCurrentStepSchema,
    GetCurrentStepKey,
};
