const LATIN_TEXT_PATTERN =
  /[^\u0041-\u005A\u0061-\u007A\u00C0-\u017F0-9 .,'-]/g;
const NOTES_PATTERN =
  /[^\u0041-\u005A\u0061-\u007A\u00C0-\u017F0-9 .,;:()'"/%+-]/g;

export function sanitizeMedicineName(value: string) {
  return value.replace(LATIN_TEXT_PATTERN, '').replace(/\s{2,}/g, ' ');
}

export function sanitizePersonName(value: string) {
  return value
    .replace(LATIN_TEXT_PATTERN, '')
    .replace(/[0-9]/g, '')
    .replace(/\s{2,}/g, ' ');
}

export function sanitizeNotes(value: string) {
  return value.replace(NOTES_PATTERN, '').replace(/\s{2,}/g, ' ');
}

export function sanitizeDecimal(value: string) {
  const normalized = value.replace(',', '.').replace(/[^0-9.]/g, '');
  const [integerPart, ...decimalParts] = normalized.split('.');
  const integer = integerPart.slice(0, 5);
  const decimal = decimalParts.join('').slice(0, 2);

  return normalized.includes('.') ? `${integer}.${decimal}` : integer;
}

export function sanitizeDigits(value: string, maxLength?: number) {
  const digits = value.replace(/\D/g, '');
  return typeof maxLength === 'number' ? digits.slice(0, maxLength) : digits;
}

export function sanitizePhone(value: string) {
  const cleaned = value.replace(/[^\d+ -]/g, '').replace(/(?!^)\+/g, '');
  return cleaned.replace(/\s{2,}/g, ' ');
}

export function sanitizeBloodType(value: string) {
  return value
    .toUpperCase()
    .replace(/[^ABO+-]/g, '')
    .slice(0, 3);
}

export function normalizeTime(value: string) {
  const digits = sanitizeDigits(value, 4).padStart(4, '0');
  const hours = Math.min(Number(digits.slice(0, 2)), 23);
  const minutes = Math.min(Number(digits.slice(2, 4)), 59);

  return formatTime(hours, minutes);
}

export function formatTime(hours: number, minutes: number) {
  const safeHours = ((hours % 24) + 24) % 24;
  const safeMinutes = ((minutes % 60) + 60) % 60;

  return `${safeHours.toString().padStart(2, '0')}:${safeMinutes
    .toString()
    .padStart(2, '0')}`;
}

export function getTimeParts(value: string) {
  const [hours = '08', minutes = '00'] = normalizeTime(value).split(':');

  return {
    hours: Number(hours),
    minutes: Number(minutes),
  };
}
