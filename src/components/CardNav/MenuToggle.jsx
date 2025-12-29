import { HiOutlineBars3, HiOutlineXMark } from 'react-icons/hi2';

const MenuToggle = ({ isOpen, onToggle }) => (
  <button
    onClick={onToggle}
    className="flex h-10 w-10 items-center justify-center rounded-full text-current transition hover:bg-black/5"
  >
    {isOpen ? (
      <HiOutlineXMark className="h-6 w-6" />
    ) : (
      <HiOutlineBars3 className="h-6 w-6" />
    )}
  </button>
);

export default MenuToggle;
