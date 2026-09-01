export default function SectionLabel({ index, label }: { index: string; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="label-eyebrow text-rust">{index}</span>
      <span className="h-px w-8 bg-rust/60" />
      <span className="label-eyebrow text-steel">{label}</span>
    </div>
  );
}
