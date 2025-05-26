import { AxiosError } from 'axios';

export function extractCorrectErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    return (
      error.response?.data?.detail ||
      error.response?.data?.message ||
      'An unknown error occurred'
    );
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
}
