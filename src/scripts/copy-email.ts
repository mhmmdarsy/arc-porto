/** Initialize click-to-copy email interaction on #copy-email-btn. */
export function initCopyEmail(): void {
  const copyBtn = document.getElementById('copy-email-btn');
  const copyText = document.getElementById('copy-text');

  copyBtn?.addEventListener('click', async () => {
    const email = copyBtn.getAttribute('data-email');
    if (!email || !copyText) return;

    try {
      await navigator.clipboard.writeText(email);
      copyText.textContent = 'Copied!';
      copyBtn.classList.add('border-emerald-500', 'text-emerald-500');

      setTimeout(() => {
        copyText.textContent = 'Copy';
        copyBtn.classList.remove('border-emerald-500', 'text-emerald-500');
      }, 2000);
    } catch {
      // Fallback
      copyText.textContent = 'Copied!';
      setTimeout(() => {
        copyText.textContent = 'Copy';
      }, 2000);
    }
  });
}
