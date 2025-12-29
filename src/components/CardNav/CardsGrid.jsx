import { forwardRef } from 'react';
import NavCard from './NavCard';

const CardsGrid = forwardRef(({ items, setCardRef }, ref) => (
  <div
    ref={ref}
    className="flex flex-col gap-4 px-6 pb-6 pt-[88px] md:flex-row"
  >
    {items.map((item, idx) => (
      <NavCard key={item.label} ref={setCardRef(idx)} {...item} />
    ))}
  </div>
));

export default CardsGrid;
