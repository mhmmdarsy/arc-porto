import { formatWitaTime } from '@/utils/time';

/** Initialize live WITA clock updates on #wita-clock every second. */
export function initWitaClock(): void {
  const updateWitaClock = () => {
    const clockEl = document.getElementById('wita-clock');
    if (!clockEl) return;

    const now = new Date();
    clockEl.textContent = formatWitaTime(now);
    clockEl.setAttribute('datetime', now.toISOString());
  };

  updateWitaClock();
  setInterval(updateWitaClock, 1000);
}
