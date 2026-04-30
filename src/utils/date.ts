export function formatDateLabel(date: Date) {
  return date.toLocaleDateString('es-BO', {
    weekday: 'long',
    day: '2-digit',
    month: 'short',
  });
}
