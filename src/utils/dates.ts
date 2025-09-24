export function formatDateDisplay(input: string): string {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return input;
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}

export function computeActiveDays(firstSeen: string, lastSeen: string): number {
  const first = new Date(firstSeen);
  const last = new Date(lastSeen);
  const dayMs = 24 * 60 * 60 * 1000;
  if (Number.isNaN(first.getTime()) || Number.isNaN(last.getTime())) return 0;
  const diff = Math.max(0, last.getTime() - first.getTime());
  return Math.floor(diff / dayMs);
}

export function formatActiveDuration(firstSeen: string, lastSeen: string): string {
  const days = computeActiveDays(firstSeen, lastSeen);
  if (days < 7) {
    return `${days} day${days === 1 ? '' : 's'}`;
  }
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return `${weeks} week${weeks === 1 ? '' : 's'}`;
  }
  const months = Math.floor(days / 30);
  const remainingDays = days - months * 30;
  const weeks = Math.floor(remainingDays / 7);
  if (weeks > 0) {
    return `${months} month${months === 1 ? '' : 's'} ${weeks} week${weeks === 1 ? '' : 's'}`;
  }
  return `${months} month${months === 1 ? '' : 's'}`;
}


