// dateUtils.ts
export function toISOWithTZ(date: string, time: string): string {
  return `${date}T${time}:00.000Z`;
}