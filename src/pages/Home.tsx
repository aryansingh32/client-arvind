import { Link } from "react-router-dom";
import SectionLabel from "../components/SectionLabel";
import StatBlock from "../components/StatBlock";
import Reveal from "../components/Reveal";
import AnimatedText from "../components/AnimatedText";
import MagneticButton from "../components/MagneticButton";
import VideoHero from "../components/VideoHero";
import { useContent } from "../lib/content";
import { whatsappLink } from "../lib/whatsapp";
import { useParallax } from "../lib/useParallax";

export default function Home() {
  const { company, siteSettings, home, timeline, specializations, projects, equipmentHighlights, certifications, awards, contactContent } =
    useContent();
  const heroBgRef = useParallax<HTMLDivElement>(0.06, 36);
  const featuredProjects = projects.slice(0, 5);
  const { sections } = home;

  return (
    <>
      {/* 1. HERO */}
      <section className="relative h-[92vh] min-h-[600px] max-h-[880px] flex items-end overflow-hidden bg-charcoal">
        <div ref={heroBgRef} className="absolute left-0 right-0" style={{ top: "-6%", bottom: "-6%" }}>
          <VideoHero
            src={siteSettings.heroVideo}
            poster={siteSettings.heroPoster}
            alt={siteSettings.heroVideoAlt}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/55 to-charcoal/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/70 via-charcoal/20 to-transparent" />

        <div className="container-edge relative z-10 pb-14 md:pb-20 pt-32">
          <p className="animate-hero-in label-eyebrow text-rust-light mb-5" style={{ animationDelay: "100ms" }}>
            {home.heroEyebrow}
          </p>
          <AnimatedText
            as="h1"
            trigger="mount"
            baseDelay={220}
            wordDelay={55}
            lines={[home.heroHeadlineLine1, home.heroHeadlineLine2]}
            className="text-white font-semibold uppercase leading-[1.06] tracking-tight text-hero-display max-w-4xl break-words"
          />
          <p
            className="animate-hero-in mt-6 max-w-xl text-ivory/80 text-base md:text-lg leading-relaxed"
            style={{ animationDelay: "380ms" }}
          >
            {home.heroIntro}
          </p>
          <div className="animate-hero-in mt-9 flex flex-wrap gap-4" style={{ animationDelay: "520ms" }}>
            <MagneticButton>
              <Link
                to={home.heroCtaPrimaryTo}
                className="group inline-flex items-center gap-2.5 bg-rust text-white px-7 py-3.5 label-eyebrow hover:bg-rust-dark hover:shadow-[0_6px_24px_rgba(184,83,31,0.4)] transition-all duration-300"
              >
                {home.heroCtaPrimaryLabel}
                <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </MagneticButton>
            <MagneticButton>
              <Link
                to={home.heroCtaSecondaryTo}
                className="group inline-flex items-center gap-2.5 border border-ivory/40 text-white px-7 py-3.5 label-eyebrow hover:border-ivory hover:bg-white/5 transition-all duration-300"
              >
                {home.heroCtaSecondaryLabel}
                <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </MagneticButton>
          </div>
        </div>

        <div
          className="hidden md:flex animate-hero-in absolute bottom-8 right-6 xl:right-10 items-center gap-2 text-ivory/50 label-eyebrow"
          style={{ animationDelay: "700ms" }}
        >
          <span className="w-6 h-px bg-ivory/30" />
          {home.scrollLabel}
        </div>
      </section>

      {/* 2. CREDIBILITY NUMBERS */}
      <section className="bg-charcoal text-ivory border-t border-ivory/10">
        <div className="container-edge py-10 md:py-12 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-8">
          {home.stats.map((s, i) => (
            <StatBlock key={s.label} dark delay={i * 80} value={s.value} label={s.label} />
          ))}
        </div>
      </section>

      {/* 3. ABOUT / JOURNEY */}
      <section className="container-edge py-20 md:py-28">
        <SectionLabel index={sections.about.eyebrowIndex} label={sections.about.eyebrowLabel} />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          <Reveal className="lg:col-span-5">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight uppercase whitespace-pre-line">
              {sections.about.heading}
            </h2>
            <p className="mt-6 text-steel leading-relaxed">{sections.about.body}</p>
            <Link to="/about" className="group mt-7 inline-flex items-center gap-2 label-eyebrow text-rust hover:text-rust-dark">
              {sections.about.linkLabel} <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>

          <div className="lg:col-span-7">
            <div className="flex flex-col md:flex-row">
              {timeline.map((t, i) => (
                <Reveal key={t.year} delay={i * 120} className="flex-1 relative pt-6 pb-2 md:px-6 first:pl-0">
                  <div className="flex items-center gap-3 md:block">
                    <span className="label-eyebrow text-rust">{t.year}</span>
                    <span className="hidden md:block h-px w-full bg-concrete mt-3" />
                  </div>
                  <p className="mt-3 font-semibold text-charcoal">{t.title}</p>
                  <p className="mt-2 text-sm text-steel leading-relaxed">{t.body}</p>
                  {i < timeline.length - 1 && (
                    <span className="md:hidden block h-px w-full bg-concrete mt-5" />
                  )}
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. SERVICES */}
      <section className="relative bg-ivory border-y border-concrete overflow-hidden">
        <span
          aria-hidden="true"
          className="pointer-events-none select-none absolute -top-6 right-4 md:right-10 text-[8rem] md:text-[13rem] font-semibold text-charcoal/[0.035] leading-none"
        >
          {sections.services.eyebrowIndex}
        </span>
        <div className="container-edge py-20 md:py-28 relative">
          <Reveal>
            <SectionLabel index={sections.services.eyebrowIndex} label={sections.services.eyebrowLabel} />
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight uppercase max-w-2xl">
              {sections.services.heading}
            </h2>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-px bg-concrete">
            {specializations.map((s, i) => (
              <Reveal key={s.number} delay={i * 90} className="bg-ivory group relative overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img
                    src={s.image}
                    alt={s.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="p-5">
                  <span className="label-eyebrow text-rust">{s.number}</span>
                  <p className="mt-2 font-semibold leading-snug">{s.title}</p>
                  <p className="text-xs text-steel">{s.subtitle}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Link to="/services" className="group mt-8 inline-flex items-center gap-2 label-eyebrow text-rust hover:text-rust-dark">
            {sections.services.linkLabel} <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* 5. FEATURED PROJECTS */}
      <section className="container-edge py-20 md:py-28">
        <Reveal>
          <SectionLabel index={sections.projects.eyebrowIndex} label={sections.projects.eyebrowLabel} />
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight uppercase max-w-xl">
              {sections.projects.heading}
            </h2>
            <Link to="/projects" className="group label-eyebrow text-rust hover:text-rust-dark inline-flex items-center gap-2">
              {sections.projects.linkLabel} <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>

        <div className="mt-10 border-t border-charcoal/15">
          {featuredProjects.map((p, i) => (
            <Reveal
              key={p.id}
              delay={i * 60}
              className="grid grid-cols-2 md:grid-cols-12 gap-2 md:gap-4 py-5 border-b border-charcoal/15 items-center hover:bg-ivory/60 transition-colors"
            >
              <span className="label-eyebrow text-rust md:col-span-2">{p.year}</span>
              <span className="col-span-2 md:col-span-5 font-medium">{p.title}</span>
              <span className="text-sm text-steel md:col-span-3">{p.location}</span>
              <span className="text-sm text-steel md:col-span-1">{p.client}</span>
              <span className="text-sm font-mono md:col-span-1 md:text-right">₹{p.workDoneCr} Cr</span>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 6. EXECUTION CAPABILITY */}
      <section className="relative bg-charcoal text-ivory overflow-hidden">
        <span
          aria-hidden="true"
          className="pointer-events-none select-none absolute -top-6 right-4 md:right-10 text-[8rem] md:text-[13rem] font-semibold text-ivory/[0.04] leading-none"
        >
          {sections.capability.eyebrowIndex}
        </span>
        <div className="container-edge py-20 md:py-28 relative">
          <Reveal>
            <SectionLabel index={sections.capability.eyebrowIndex} label={sections.capability.eyebrowLabel} />
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight uppercase max-w-xl text-white">
                {sections.capability.heading}
              </h2>
              <Link to="/capabilities" className="group label-eyebrow text-rust-light hover:text-white inline-flex items-center gap-2">
                {sections.capability.linkLabel} <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-8">
            {equipmentHighlights.map((e, i) => (
              <StatBlock key={e.label} dark delay={i * 70} value={String(e.count)} label={e.label} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. QUALITY / SAFETY / ENVIRONMENT */}
      <section className="container-edge py-20 md:py-28">
        <Reveal>
          <SectionLabel index={sections.quality.eyebrowIndex} label={sections.quality.eyebrowLabel} />
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight uppercase max-w-2xl">
            {sections.quality.heading}
          </h2>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {certifications.map((c, i) => (
            <Reveal key={c.id} delay={i * 100}>
              <Link
                to="/certifications"
                className="group block border border-concrete hover:border-rust hover:shadow-lg transition-all duration-300"
              >
                <div className="aspect-[4/3] overflow-hidden border-b border-concrete bg-ivory">
                  <img
                    src={c.image}
                    alt={c.standard}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="p-6">
                  <span className="label-eyebrow text-rust">{c.pillar}</span>
                  <p className="mt-2 font-semibold">{c.standard}</p>
                  <p className="mt-1 text-sm text-steel">{c.name}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 8. PROJECT PHOTOGRAPHY */}
      <section className="bg-ivory border-y border-concrete">
        <div className="container-edge py-20 md:py-28">
          <Reveal>
            <SectionLabel index={sections.photography.eyebrowIndex} label={sections.photography.eyebrowLabel} />
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight uppercase max-w-2xl">
              {sections.photography.heading}
            </h2>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
            {sections.photography.items.map((item, i) => (
              <Reveal
                key={item.image}
                as="figure"
                delay={i === 0 ? 0 : i * 120}
                className={`overflow-hidden group ${i === 0 ? "md:row-span-2" : ""}`}
              >
                <img
                  src={item.image}
                  alt={item.caption}
                  className={`w-full h-full object-cover ${i === 0 ? "aspect-[4/3] md:aspect-auto" : "aspect-[4/3]"} transition-transform duration-700 group-hover:scale-105`}
                  loading="lazy"
                  decoding="async"
                />
                <figcaption className="mt-3 text-sm text-steel">{item.caption}</figcaption>
              </Reveal>
            ))}
          </div>
          <Link to="/gallery" className="group mt-8 inline-flex items-center gap-2 label-eyebrow text-rust hover:text-rust-dark">
            {sections.photography.linkLabel} <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* 9. CERTIFICATIONS / RECOGNITION */}
      <section className="container-edge py-20 md:py-28">
        <Reveal>
          <SectionLabel index={sections.recognition.eyebrowIndex} label={sections.recognition.eyebrowLabel} />
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight uppercase max-w-2xl">
            {sections.recognition.heading}
          </h2>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {awards.map((a, i) => (
            <Reveal
              key={a.id}
              delay={i * 100}
              className="border border-concrete p-6 hover:border-rust/50 hover:shadow-md transition-all duration-300"
            >
              <p className="label-eyebrow text-rust">{a.period}</p>
              <p className="mt-3 font-semibold">{a.title}</p>
              <p className="mt-1 text-sm text-steel">{a.issuer}</p>
              <p className="mt-4 text-sm text-charcoal/80 leading-relaxed">{a.detail}</p>
            </Reveal>
          ))}
        </div>
        <Link to="/certifications" className="group mt-8 inline-flex items-center gap-2 label-eyebrow text-rust hover:text-rust-dark">
          {sections.recognition.linkLabel} <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </section>

      {/* 10. FINAL CONTACT CTA */}
      <section className="relative bg-charcoal">
        <div className="absolute inset-0">
          <img
            src={sections.finalCta.backgroundImage}
            alt="Structural fabrication and welding work"
            className="w-full h-full object-cover opacity-30"
            loading="lazy"
            decoding="async"
          />
        </div>
        <Reveal className="relative container-edge py-24 md:py-32 text-center">
          <h2 className="text-white text-3xl md:text-5xl font-semibold uppercase tracking-tight max-w-3xl mx-auto">
            {sections.finalCta.heading}
          </h2>
          <p className="mt-5 text-ivory/70 max-w-lg mx-auto">{sections.finalCta.body}</p>
          <div className="mt-9 flex flex-wrap gap-4 justify-center">
            <MagneticButton>
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2.5 bg-rust text-white px-7 py-3.5 label-eyebrow hover:bg-rust-dark hover:shadow-[0_6px_24px_rgba(184,83,31,0.4)] transition-all duration-300"
              >
                {sections.finalCta.ctaPrimaryLabel}
                <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </MagneticButton>
            <MagneticButton>
              <a
                href={whatsappLink(contactContent.whatsappDefaultMessage, company.whatsappNumber)}
                target="_blank"
                rel="noreferrer"
                className="inline-block border border-ivory/40 text-white px-7 py-3.5 label-eyebrow hover:border-ivory hover:bg-white/5 transition-all duration-300"
              >
                {sections.finalCta.ctaSecondaryLabel}
              </a>
            </MagneticButton>
          </div>
        </Reveal>
      </section>
    </>
  );
}

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
