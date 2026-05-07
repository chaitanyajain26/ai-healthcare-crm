export default function StatusBadge({ children, tone = "slate" }) {
  const toneMap = {
    positive: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    neutral: "bg-slate-100 text-slate-700 ring-slate-200",
    warning: "bg-amber-50 text-amber-700 ring-amber-200",
    slate: "bg-slate-100 text-slate-700 ring-slate-200"
  };

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${toneMap[tone]}`}>
      {children}
    </span>
  );
}
