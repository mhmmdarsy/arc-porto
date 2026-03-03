import { forwardRef } from 'react';
import NavCard from './NavCard';
import type { NavigationCardItem } from '../../types/navigation';

interface CardsGridProps {
  items: NavigationCardItem[];
  setCardRef: (index: number) => (element: HTMLDivElement | null) => void;
}

const CardsGrid = forwardRef<HTMLDivElement, CardsGridProps>(
  ({ items, setCardRef }, ref) => (
    <div
      ref={ref}
      className="flex flex-col gap-4 px-6 pb-6 pt-[88px] md:flex-row"
    >
      {items.map((item, index) => (
        <NavCard key={item.label} ref={setCardRef(index)} {...item} />
      ))}
    </div>
  ),
);

CardsGrid.displayName = 'CardsGrid';

export default CardsGrid;
