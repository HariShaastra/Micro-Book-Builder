import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateWordCount(text: string): number {
  const cleanText = text.replace(/<\/?[^>]+(>|$)/g, "").trim();
  return cleanText ? cleanText.split(/\s+/).length : 0;
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
