import PageHero from "../components/PageHero";
import SectionLabel from "../components/SectionLabel";
import {
  company,
  timeline,
  specializations,
  methodology,
  commitment,
} from "../data/company";

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="About Anand Techno-Fab"
        intro="A team of young, dynamic and technically qualified personnel with 20 years of varied experience in infrastructure execution."
      />

      {/* Journey */}
      <section className="container-edge py-20 md:py-28">
        <SectionLabel index="01" label="Our Journey" />
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight uppercase max-w-2xl">
          From Anand Construction to Anand Techno-Fab LLP
        </h2>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
          {timeline.map((t) => (
            <div key={t.year} className="border-t-2 border-rust pt-5">
              <p className="text-3xl font-semibold tracking-tight">{t.year}</p>
              <p className="mt-2 font-semibold">{t.title}</p>
              <p className="mt-3 text-sm text-steel leading-relaxed">{t.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What we do */}
      <section className="bg-ivory border-y border-concrete">
        <div className="container-edge py-20 md:py-28">
          <SectionLabel index="02" label="What We Do" />
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight uppercase max-w-2xl">
            An upcoming construction company undertaking turnkey projects
          </h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {specializations.map((s) => (
              <div key={s.number} className="flex gap-4">
                <span className="label-eyebrow text-rust">{s.number}</span>
                <div>
                  <p className="font-semibold leading-snug">
                    {s.title} <span className="text-steel font-normal">{s.subtitle}</span>
                  </p>
                  <p className="mt-2 text-sm text-steel leading-relaxed">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Approach / methodology */}
      <section className="container-edge py-20 md:py-28">
        <SectionLabel index="03" label="Our Approach" />
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight uppercase max-w-2xl">
          How we work
        </h2>
        <p className="mt-4 max-w-2xl text-steel">
          Our execution methodology, applied consistently across every project site.
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-concrete border border-concrete">
          {methodology.map((m) => (
            <div key={m.number} className="bg-paper p-6">
              <span className="label-eyebrow text-rust">{m.number}</span>
              <p className="mt-3 font-semibold leading-snug">{m.title}</p>
              <p className="mt-2 text-sm text-steel leading-relaxed">{m.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Commitment */}
      <section className="bg-charcoal text-ivory">
        <div className="container-edge py-20 md:py-28 grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <SectionLabel index="04" label="Commitment" />
            <h2 className="text-3xl font-semibold tracking-tight uppercase text-white">
              Fully committed to excellence
            </h2>
          </div>
          <div className="md:col-span-8 md:pt-1">
            <p className="text-lg leading-relaxed text-ivory/80 max-w-2xl">{commitment}</p>
          </div>
        </div>
      </section>

      {/* Corporate details */}
      <section className="container-edge py-20 md:py-28">
        <SectionLabel index="05" label="Company Information" />
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight uppercase max-w-2xl">
          Corporate details
        </h2>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 max-w-4xl">
          <InfoRow label="Legal Name" value={company.legalName} />
          <InfoRow label="Ownership" value={company.ownership} />
          <InfoRow
            label="Partners"
            value={company.partners.map((p) => `${p.name} (${p.role})`).join(", ")}
          />
          <InfoRow label="Registered / Operational Address" value={company.registeredAddress} />
          <InfoRow label="LLP Identity No." value={company.llpIdentityNo} />
          <InfoRow label="GST No." value={company.gstNo} />
          <InfoRow label="EPF Registration No." value={company.epfRegNo} />
          <InfoRow label="Udyam Registration No." value={company.udyamRegNo} />
        </div>
      </section>
    </>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-concrete pt-3">
      <p className="label-eyebrow text-steel">{label}</p>
      <p className="mt-1.5 text-sm md:text-base">{value}</p>
    </div>
  );
}
