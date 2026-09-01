export default function StatBlock({
  value,
  label,
  dark = false,
}: {
  value: string;
  label: string;
  dark?: boolean;
}) {
  return (
    <div className={`py-6 ${dark ? "border-ivory/15" : "border-concrete"} border-t`}>
      <p className={`text-4xl md:text-5xl font-semibold tracking-tight ${dark ? "text-paper" : "text-charcoal"}`}>
        {value}
      </p>
      <p className={`mt-2 label-eyebrow ${dark ? "text-ivory/50" : "text-steel"}`}>{label}</p>
    </div>
  );
}
