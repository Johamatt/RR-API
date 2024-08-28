export function parseTimeString(timeString: string): number {
  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  return (hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0);
}

export function formatTime(totalSeconds: number): string {
  const days = Math.floor(totalSeconds / (24 * 3600));
  totalSeconds %= 24 * 3600;
  const hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const parts: string[] = [];

  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  else if (hours === 0 && minutes === 0 && seconds > 0)
    parts.push(`${seconds}s`);

  if (hours === 0 && minutes === 0 && seconds > 0) parts.push(`${seconds}s`);

  return parts.join(' ');
}
