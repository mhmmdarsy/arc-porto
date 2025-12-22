// Utility function to merge Tailwind and conditional classes
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge class names conditionally and with Tailwind support
 * @param inputs - class values
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
