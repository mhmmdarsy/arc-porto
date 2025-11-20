const Brand = ({ brandText }) => (
  <div className="flex items-center gap-2">
    <span className="text-lg font-semibold tracking-tight text-slate-900">
      {brandText}
    </span>
  </div>
);

export default Brand;
