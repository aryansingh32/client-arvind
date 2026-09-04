import AnimatedNumber from "./AnimatedNumber";
import Reveal from "./Reveal";

export default function StatBlock({
  value,
  label,
  dark = false,
  delay = 0,
}: {
  value: string;
  label: string;
  dark?: boolean;
  delay?: number;
}) {
  return (
    <Reveal delay={delay} className={`py-6 ${dark ? "border-ivory/15" : "border-concrete"} border-t`}>
      <AnimatedNumber
        value={value}
        className={`block text-4xl md:text-5xl font-semibold tracking-tight ${dark ? "text-paper" : "text-charcoal"}`}
      />
      <p className={`mt-2 label-eyebrow ${dark ? "text-ivory/50" : "text-steel"}`}>{label}</p>
    </Reveal>
  );
}
