import PageHero from "../components/PageHero";
import SectionLabel from "../components/SectionLabel";
import { hsePolicy, qualityPolicy } from "../data/company";

export default function QualitySafety() {
  return (
    <>
      <PageHero
        eyebrow="Quality & Safety"
        title="Quality, Safety & Environment"
        intro="Our operating policies for health, safety, environment and quality management — applied consistently across every project site."
      />

      {/* HSE */}
      <section className="container-edge py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
        <div className="lg:col-span-6 order-2 lg:order-1">
          <SectionLabel index="01" label="Health, Safety & Environment" />
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight uppercase max-w-lg">
            Health, Safety &amp; Environmental Policy
          </h2>
          <p className="mt-6 text-charcoal/80 leading-relaxed max-w-lg italic border-l-2 border-rust pl-4">
            &ldquo;{hsePolicy.motto}&rdquo;
          </p>
          <ul className="mt-8 space-y-3">
            {hsePolicy.points.map((p) => (
              <li key={p} className="flex gap-3 text-sm md:text-base">
                <span className="text-rust mt-0.5">—</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-6 order-1 lg:order-2 aspect-[4/3] lg:aspect-auto overflow-hidden">
          <img
            src="/images/gallery/safety-training.jpg"
            alt="Field safety training session"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Quality */}
      <section className="bg-ivory border-y border-concrete">
        <div className="container-edge py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          <div className="lg:col-span-6 aspect-[4/3] lg:aspect-auto overflow-hidden">
            <img
              src="/images/gallery/health-checkup-camp.jpg"
              alt="Employee health checkup camp at project site"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="lg:col-span-6">
            <SectionLabel index="02" label="Quality Policy" />
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight uppercase max-w-lg">
              Quality Policy
            </h2>
            <p className="mt-6 text-charcoal/80 leading-relaxed max-w-lg italic border-l-2 border-rust pl-4">
              &ldquo;{qualityPolicy.motto}&rdquo;
            </p>
            <ul className="mt-8 space-y-3">
              {qualityPolicy.points.map((p) => (
                <li key={p} className="flex gap-3 text-sm md:text-base">
                  <span className="text-rust mt-0.5">—</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* People & safety photography */}
      <section className="container-edge py-16 md:py-24">
        <SectionLabel index="03" label="Safety & People" />
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight uppercase max-w-2xl">
          Site discipline in practice
        </h2>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          <figure>
            <img src="/images/gallery/isp-kalisindh-workforce.jpg" alt="Site workforce briefing at ISP-Kalisindh Ph-I, MLIS" className="w-full aspect-[4/3] object-cover" />
            <figcaption className="mt-3 text-sm text-steel">Site workforce briefing — ISP-Kalisindh Ph-I, MLIS</figcaption>
          </figure>
          <figure>
            <img src="/images/gallery/safety-training.jpg" alt="Field safety training session" className="w-full aspect-[4/3] object-cover" />
            <figcaption className="mt-3 text-sm text-steel">Field safety training session</figcaption>
          </figure>
          <figure>
            <img src="/images/gallery/health-checkup-camp.jpg" alt="Health checkup camp, Kalisindh Phase 1 MLIS project" className="w-full aspect-[4/3] object-cover" />
            <figcaption className="mt-3 text-sm text-steel">Health checkup camp — Kalisindh Phase 1, MLIS</figcaption>
          </figure>
        </div>
      </section>
    </>
  );
}
