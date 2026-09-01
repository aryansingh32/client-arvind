import { Link } from "react-router-dom";
import SectionLabel from "../components/SectionLabel";
import StatBlock from "../components/StatBlock";
import {
  timeline,
  specializations,
  projects,
  equipmentHighlights,
  certifications,
  awards,
} from "../data/company";
import { defaultWhatsappMessage, whatsappLink } from "../lib/whatsapp";

const featuredProjects = projects.slice(0, 5);

export default function Home() {
  return (
    <>
      {/* 1. HERO */}
      <section className="relative h-[92vh] min-h-[600px] max-h-[880px] flex items-end overflow-hidden bg-charcoal">
        <img
          src="/images/gallery/kalisindh-trench.jpg"
          alt="Pipeline installation at Kalisindh Phase-I, MLIS, L&T ECC Division, Sonkach, Dewas, MP"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/55 to-charcoal/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/70 via-charcoal/20 to-transparent" />

        <div className="container-edge relative z-10 pb-14 md:pb-20 pt-32">
          <p className="label-eyebrow text-rust-light mb-5">Anand Techno-Fab LLP · Ahmedabad, Gujarat</p>
          <h1 className="text-white font-semibold uppercase leading-[1.06] tracking-tight text-[1.9rem] sm:text-5xl md:text-7xl max-w-4xl break-words">
            Engineering Infrastructure.
            <br />
            Delivering With Precision.
          </h1>
          <p className="mt-6 max-w-xl text-ivory/80 text-base md:text-lg leading-relaxed">
            Infrastructure development and execution across water pipeline
            projects, structural fabrication &amp; erection, earthwork,
            mining and related operations.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              to="/capabilities"
              className="bg-rust text-white px-7 py-3.5 label-eyebrow hover:bg-rust-dark transition-colors"
            >
              Explore Our Capabilities
            </Link>
            <Link
              to="/projects"
              className="border border-ivory/40 text-white px-7 py-3.5 label-eyebrow hover:border-ivory hover:bg-white/5 transition-colors"
            >
              View Projects
            </Link>
          </div>
        </div>
      </section>

      {/* 2. CREDIBILITY NUMBERS */}
      <section className="bg-charcoal text-ivory border-t border-ivory/10">
        <div className="container-edge py-10 md:py-12 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-8">
          <StatBlock dark value="20+" label="Years of Field Experience" />
          <StatBlock dark value="15" label="Project References in Profile" />
          <StatBlock dark value="145+" label="Skilled Contractual Workforce" />
          <StatBlock dark value="3" label="ISO Certifications Held" />
        </div>
      </section>

      {/* 3. ABOUT / JOURNEY */}
      <section className="container-edge py-20 md:py-28">
        <SectionLabel index="01" label="About" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          <div className="lg:col-span-5">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight uppercase">
              Two decades of building
              <br /> India's infrastructure
            </h2>
            <p className="mt-6 text-steel leading-relaxed">
              We started our journey in 2004 with the name Anand Construction,
              providing services in water pipeline projects and structural
              fabrication. With years of experience and sustainable growth,
              the venture was incorporated as Anand Techno-Fab LLP in 2018 to
              continue the journey in infrastructure development &amp;
              solutions across irrigation, structural fabrication &amp;
              erection, earthwork and mining.
            </p>
            <Link to="/about" className="mt-7 inline-flex items-center gap-2 label-eyebrow text-rust hover:text-rust-dark">
              Read our full story <ArrowIcon />
            </Link>
          </div>

          <div className="lg:col-span-7">
            <div className="flex flex-col md:flex-row">
              {timeline.map((t, i) => (
                <div key={t.year} className="flex-1 relative pt-6 pb-2 md:px-6 first:pl-0">
                  <div className="flex items-center gap-3 md:block">
                    <span className="label-eyebrow text-rust">{t.year}</span>
                    <span className="hidden md:block h-px w-full bg-concrete mt-3" />
                  </div>
                  <p className="mt-3 font-semibold text-charcoal">{t.title}</p>
                  <p className="mt-2 text-sm text-steel leading-relaxed">{t.body}</p>
                  {i < timeline.length - 1 && (
                    <span className="md:hidden block h-px w-full bg-concrete mt-5" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. SERVICES */}
      <section className="bg-ivory border-y border-concrete">
        <div className="container-edge py-20 md:py-28">
          <SectionLabel index="02" label="Specializations" />
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight uppercase max-w-2xl">
            Built for complex project execution
          </h2>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-px bg-concrete">
            {specializations.map((s) => (
              <div key={s.number} className="bg-ivory group relative overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img
                    src={s.image}
                    alt={s.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <span className="label-eyebrow text-rust">{s.number}</span>
                  <p className="mt-2 font-semibold leading-snug">{s.title}</p>
                  <p className="text-xs text-steel">{s.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
          <Link to="/services" className="mt-8 inline-flex items-center gap-2 label-eyebrow text-rust hover:text-rust-dark">
            All services <ArrowIcon />
          </Link>
        </div>
      </section>

      {/* 5. FEATURED PROJECTS */}
      <section className="container-edge py-20 md:py-28">
        <SectionLabel index="03" label="Project Experience" />
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight uppercase max-w-xl">
            Selected project experience
          </h2>
          <Link to="/projects" className="label-eyebrow text-rust hover:text-rust-dark inline-flex items-center gap-2">
            View all 15 projects <ArrowIcon />
          </Link>
        </div>

        <div className="mt-10 border-t border-charcoal/15">
          {featuredProjects.map((p) => (
            <div
              key={p.id}
              className="grid grid-cols-2 md:grid-cols-12 gap-2 md:gap-4 py-5 border-b border-charcoal/15 items-center"
            >
              <span className="label-eyebrow text-rust md:col-span-2">{p.year}</span>
              <span className="col-span-2 md:col-span-5 font-medium">{p.title}</span>
              <span className="text-sm text-steel md:col-span-3">{p.location}</span>
              <span className="text-sm text-steel md:col-span-1">{p.client}</span>
              <span className="text-sm font-mono md:col-span-1 md:text-right">₹{p.workDoneCr} Cr</span>
            </div>
          ))}
        </div>
      </section>

      {/* 6. EXECUTION CAPABILITY */}
      <section className="bg-charcoal text-ivory">
        <div className="container-edge py-20 md:py-28">
          <SectionLabel index="04" label="Execution Capability" />
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight uppercase max-w-xl text-white">
              A fleet built for scale
            </h2>
            <Link to="/capabilities" className="label-eyebrow text-rust-light hover:text-white inline-flex items-center gap-2">
              View complete equipment <ArrowIcon />
            </Link>
          </div>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-8">
            {equipmentHighlights.map((e) => (
              <StatBlock key={e.label} dark value={String(e.count)} label={e.label} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. QUALITY / SAFETY / ENVIRONMENT */}
      <section className="container-edge py-20 md:py-28">
        <SectionLabel index="05" label="Quality, Safety & Environment" />
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight uppercase max-w-2xl">
          Certified across quality, safety and environment
        </h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {certifications.map((c) => (
            <Link
              key={c.id}
              to="/certifications"
              className="group border border-concrete hover:border-rust transition-colors"
            >
              <div className="aspect-[4/3] overflow-hidden border-b border-concrete bg-ivory">
                <img
                  src={c.image}
                  alt={c.standard}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <span className="label-eyebrow text-rust">{c.pillar}</span>
                <p className="mt-2 font-semibold">{c.standard}</p>
                <p className="mt-1 text-sm text-steel">{c.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 8. PROJECT PHOTOGRAPHY */}
      <section className="bg-ivory border-y border-concrete">
        <div className="container-edge py-20 md:py-28">
          <SectionLabel index="06" label="Field Execution" />
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight uppercase max-w-2xl">
            Grounded in real field work
          </h2>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
            <figure className="md:row-span-2">
              <img
                src="/images/gallery/kalisindh-aerial.jpg"
                alt="Kalisindh Phase-I, MLIS pipeline route, Dewas, Madhya Pradesh"
                className="w-full h-full object-cover aspect-[4/3] md:aspect-auto"
              />
              <figcaption className="mt-3 text-sm text-steel">
                Kalisindh Phase-I, MLIS — Dewas, Madhya Pradesh
              </figcaption>
            </figure>
            <figure>
              <img
                src="/images/gallery/sauni-earthwork.jpg"
                alt="Earthwork excavation, SAUNI Yojana L3P3, Gujarat"
                className="w-full h-full object-cover aspect-[4/3]"
              />
              <figcaption className="mt-3 text-sm text-steel">
                Earthwork Excavation — SAUNI Yojana L3P3, Gujarat
              </figcaption>
            </figure>
            <figure>
              <img
                src="/images/gallery/mining-jafrabad-1.jpg"
                alt="Mining operations, Jafrabad, Amreli"
                className="w-full h-full object-cover aspect-[4/3]"
              />
              <figcaption className="mt-3 text-sm text-steel">
                Mining Operations — Jafrabad, Amreli
              </figcaption>
            </figure>
          </div>
          <Link to="/gallery" className="mt-8 inline-flex items-center gap-2 label-eyebrow text-rust hover:text-rust-dark">
            View full gallery <ArrowIcon />
          </Link>
        </div>
      </section>

      {/* 9. CERTIFICATIONS / RECOGNITION */}
      <section className="container-edge py-20 md:py-28">
        <SectionLabel index="07" label="Recognition" />
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight uppercase max-w-2xl">
          Recognized by our clients
        </h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {awards.map((a) => (
            <div key={a.id} className="border border-concrete p-6">
              <p className="label-eyebrow text-rust">{a.period}</p>
              <p className="mt-3 font-semibold">{a.title}</p>
              <p className="mt-1 text-sm text-steel">{a.issuer}</p>
              <p className="mt-4 text-sm text-charcoal/80 leading-relaxed">{a.detail}</p>
            </div>
          ))}
        </div>
        <Link to="/certifications" className="mt-8 inline-flex items-center gap-2 label-eyebrow text-rust hover:text-rust-dark">
          All certifications &amp; awards <ArrowIcon />
        </Link>
      </section>

      {/* 10. FINAL CONTACT CTA */}
      <section className="relative bg-charcoal">
        <div className="absolute inset-0">
          <img
            src="/images/gallery/welding-cta.jpg"
            alt="Structural fabrication and welding work"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative container-edge py-24 md:py-32 text-center">
          <h2 className="text-white text-3xl md:text-5xl font-semibold uppercase tracking-tight max-w-3xl mx-auto">
            Have an infrastructure project in mind?
          </h2>
          <p className="mt-5 text-ivory/70 max-w-lg mx-auto">
            Let&rsquo;s discuss your requirement.
          </p>
          <div className="mt-9 flex flex-wrap gap-4 justify-center">
            <Link to="/contact" className="bg-rust text-white px-7 py-3.5 label-eyebrow hover:bg-rust-dark transition-colors">
              Start a Conversation
            </Link>
            <a
              href={whatsappLink(defaultWhatsappMessage)}
              target="_blank"
              rel="noreferrer"
              className="border border-ivory/40 text-white px-7 py-3.5 label-eyebrow hover:border-ivory hover:bg-white/5 transition-colors"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
