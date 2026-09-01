export default function PageHero({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <section className="border-b border-concrete bg-ivory">
      <div className="container-edge py-14 md:py-20">
        <p className="label-eyebrow text-rust mb-4">{eyebrow}</p>
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight uppercase max-w-4xl">
          {title}
        </h1>
        {intro && <p className="mt-5 max-w-2xl text-steel text-base md:text-lg leading-relaxed">{intro}</p>}
      </div>
    </section>
  );
}
