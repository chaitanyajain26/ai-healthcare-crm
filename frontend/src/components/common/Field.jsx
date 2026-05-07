export function Field({ label, children }) {
  return (
    <label className="block space-y-2">
      <span className="label">{label}</span>
      {children}
    </label>
  );
}
