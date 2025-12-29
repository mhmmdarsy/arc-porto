import { forwardRef } from 'react';
import { GoArrowUpRight } from 'react-icons/go';

const NavCard = forwardRef(({ label, bgColor, textColor, links }, ref) => (
  <div
    ref={ref}
    className="flex-1 min-h-[160px] rounded-2xl border border-white/10 p-5 text-white shadow-[inset_0_1px_rgba(255,255,255,0.1)]"
    style={{ backgroundColor: bgColor, color: textColor }}
  >
    <h3 className="mb-3 text-lg font-semibold">{label}</h3>
    <ul className="flex flex-col gap-1.5 text-sm">
      {links.map((link, i) => (
        <li key={`${label}-${link.label}-${i}`}>
          <a
            href={link.href}
            className="flex items-center gap-1 transition-opacity hover:opacity-80"
          >
            <GoArrowUpRight className="text-xs" />
            <span>{link.label}</span>
          </a>
        </li>
      ))}
    </ul>
  </div>
));

export default NavCard;
