export function getCurrentDateTime(): string {
  const now = new Date();

  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };

  // Format using locale (e.g., "Nov 02, 2025, 10:45 PM")
  const formatted = now.toLocaleString('en-US', options);

  // Replace the comma between date and time with a dash for your format
  return formatted.replace(',', ' -');
}

export function extractDate(dateString?: string | Date): string{
    const date = dateString ? new Date(dateString) : new Date();
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
    })
}

export function extractTime(timeString?: string | Date): string {
  const time = timeString ? new Date(timeString) : new Date();

  return time.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function caculateWorkTime(startTime: string | Date, endTime: string | Date): { hours: number, minutes: number} {
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime()
    const millisecDiff = end - start;
    const totalSeconds: number = Math.floor(millisecDiff / 1000);
    const hours: number = Math.floor(totalSeconds / 3600);
    const minutes: number = Math.floor((totalSeconds % 3600) / 60);
    return {hours, minutes};
}