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
  return formatted;
}

export function toUTCString(date: Date | undefined){
  if (!date) return null;
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds()
    )
  ).toISOString(); // Returns ISO string in UTC
};


export function extractDate(dateString?: string | Date): string{
    const date = dateString ? new Date(dateString) : new Date();
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
    })
}

export function extractFullDate(dateString?: string | Date): string{
    const date = dateString ? new Date(dateString) : new Date();
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
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

export function getTodayWeekDay(): number{
  if(new Date().getDay() == 0){
    return 6;
  }
  else{
    return(new Date().getDay()-1);
  }
}

export function getStartOfWeekDate(): Date{
  const date = new Date().getDate() - getTodayWeekDay();
  const month = new Date().getMonth();
  const year = new Date().getFullYear();
  const startWeek = new Date();
  startWeek.setDate(date);
  startWeek.setMonth(month);
  startWeek.setFullYear(year);
  startWeek.setHours(0, 0, 0, 0);
  return startWeek;
}

export function getEndOfWeekDate(): Date{
  const date = new Date().getDate() + (6-getTodayWeekDay());
  const month = new Date().getMonth();
  const year = new Date().getFullYear();
  const endWeek = new Date()
  endWeek.setDate(date);
  endWeek.setMonth(month);
  endWeek.setFullYear(year);
  endWeek.setHours(23, 59, 59, 999);
  return endWeek;
}

export function getStartOfNextWeekDate(): Date{
  const startWeek = getEndOfWeekDate();
  startWeek.setDate(getEndOfWeekDate().getDate() + 1);
  return startWeek;
}

export function getEndOfNextWeekDate(): Date{
  const endWeek = getEndOfWeekDate();
  endWeek.setDate(getEndOfWeekDate().getDate() + 7);
  return endWeek;
}
