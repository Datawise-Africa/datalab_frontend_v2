import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
/**
 * @param {...(string | import('clsx').ClassValue)[]} inputs
 */
export function cn(...inputs:ClassValue[]) {
  return twMerge(clsx(inputs));
}
