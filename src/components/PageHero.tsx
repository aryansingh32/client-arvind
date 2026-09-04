import AnimatedText from "./AnimatedText";

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
    <section className="border-b border-concrete bg-ivory overflow-hidden">
      <div className="container-edge py-14 md:py-20">
        <p className="animate-hero-in label-eyebrow text-rust mb-4" style={{ animationDelay: "60ms" }}>
          {eyebrow}
        </p>
        <AnimatedText
          as="h1"
          trigger="mount"
          baseDelay={140}
          wordDelay={50}
          lines={[title]}
          className="text-page-display font-semibold tracking-tight uppercase max-w-4xl"
        />
        {intro && (
          <p
            className="animate-hero-in mt-5 max-w-2xl text-steel text-base md:text-lg leading-relaxed"
            style={{ animationDelay: "420ms" }}
          >
            {intro}
          </p>
        )}
      </div>
    </section>
  );
}
