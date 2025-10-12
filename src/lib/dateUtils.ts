/**
 * Date utility functions for countdown calculations
 */

export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/**
 * Calculate time remaining until target date
 * @param targetDate - ISO 8601 date string
 * @returns TimeRemaining object or null if time has passed
 */
export function calculateTimeRemaining(targetDate: string): TimeRemaining | null {
  const now = new Date().getTime();
  const target = new Date(targetDate).getTime();
  const difference = target - now;
  
  if (difference <= 0) return null;
  
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((difference % (1000 * 60)) / 1000)
  };
}

/**
 * Format time remaining for display
 * @param timeRemaining - TimeRemaining object
 * @returns Formatted string for display
 */
export function formatTimeRemaining(timeRemaining: TimeRemaining): string {
  const { days, hours, minutes, seconds } = timeRemaining;
  
  if (days > 0) {
    return `${days} day${days !== 1 ? 's' : ''}, ${hours} hour${hours !== 1 ? 's' : ''}, ${minutes} minute${minutes !== 1 ? 's' : ''} remaining`;
  } else if (hours > 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''}, ${minutes} minute${minutes !== 1 ? 's' : ''} remaining`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}, ${seconds} second${seconds !== 1 ? 's' : ''} remaining`;
  } else {
    return `${seconds} second${seconds !== 1 ? 's' : ''} remaining`;
  }
}

/**
 * Get a date 5 days from now (fallback for MVP)
 * @returns ISO 8601 date string
 */
export function getDefaultActivationDate(): string {
  const now = new Date();
  const fiveDaysFromNow = new Date(now.getTime() + (5 * 24 * 60 * 60 * 1000));
  return fiveDaysFromNow.toISOString();
}
