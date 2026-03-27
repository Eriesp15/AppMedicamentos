// Date and time utility functions

const monthsInSpanish = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

const daysInSpanish = [
  'domingo',
  'lunes',
  'martes',
  'miércoles',
  'jueves',
  'viernes',
  'sábado',
];

export const formatDateInSpanish = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const dayName = daysInSpanish[dateObj.getDay()];
  const dayNum = dateObj.getDate();
  const monthName = monthsInSpanish[dateObj.getMonth()];
  const year = dateObj.getFullYear();

  return `${dayName}, ${dayNum} de ${monthName} de ${year}`;
};

export const formatDateShort = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatTime = (time: string): string => {
  // Expects time in HH:mm format
  return time;
};

export const getCurrentDateString = (): string => {
  return formatDateShort(new Date());
};

export const getDateFromString = (dateString: string): Date => {
  return new Date(dateString);
};

export const isTimeAfterNow = (timeString: string): boolean => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const timeDate = new Date();
  timeDate.setHours(hours, minutes, 0);
  return timeDate > new Date();
};

export const getDayOfWeek = (date: Date = new Date()): number => {
  return date.getDay();
};

export const shouldShowMedicationToday = (
  frequency: string,
  specificDays?: number[]
): boolean => {
  if (frequency === 'daily') {
    return true;
  }
  const today = getDayOfWeek();
  return specificDays?.includes(today) || false;
};

export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};
