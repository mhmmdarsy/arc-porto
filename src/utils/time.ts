export const WITA_TIMEZONE = 'Asia/Makassar';

/** Format a Date in WITA (UTC+8) as "HH : mm : ss" matching the footer design. */
export function formatWitaTime(now: Date = new Date()): string {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: WITA_TIMEZONE,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
      .format(now)
      .replace(/:/g, ' : ');
  } catch {
    // Fallback if timeZone is not supported in the runtime.
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const witaDate = new Date(utc + 3600000 * 8);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(witaDate.getHours())} : ${pad(witaDate.getMinutes())} : ${pad(witaDate.getSeconds())}`;
  }
}
