const CTAButton = ({ label, background, color }) => (
  <button
    className="inline-flex items-center rounded-xl border border-black/10 px-5 py-2 text-sm font-semibold shadow-[inset_0_1px_rgba(255,255,255,0.4)] transition-colors hover:bg-black/80"
    style={{ backgroundColor: background, color }}
  >
    {label}
  </button>
);

export default CTAButton;
