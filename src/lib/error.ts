import { AxiosError } from 'axios';

export function extractCorrectErrorMessage(
  error: unknown,
  fallbackMessage?: string,
): string {
  if (error instanceof AxiosError) {
    return (
      error.response?.data?.detail ||
      error.response?.data?.message ||
      fallbackMessage ||
      'An unknown error occurred'
    );
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallbackMessage || 'An unknown error occurred';
}
