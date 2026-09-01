import { useState } from "react";
import PageHero from "../components/PageHero";
import SectionLabel from "../components/SectionLabel";
import Lightbox from "../components/Lightbox";
import {
  certifications,
  statutoryRegistrations,
  awards,
  completionCertificate,
} from "../data/company";

export default function Certifications() {
  const [certIndex, setCertIndex] = useState<number | null>(null);
  const [regIndex, setRegIndex] = useState<number | null>(null);
  const [awardIndex, setAwardIndex] = useState<number | null>(null);
  const [showCompletion, setShowCompletion] = useState(false);

  const certLightboxItems = certifications.map((c) => ({
    image: c.image,
    title: c.standard,
    subtitle: c.name,
  }));
  const regLightboxItems = statutoryRegistrations.map((r) => ({
    image: r.image,
    title: r.title,
  }));
  const awardLightboxItems = awards.map((a) => ({
    image: a.image,
    title: a.title,
    subtitle: a.issuer,
  }));

  return (
    <>
      <PageHero
        eyebrow="Certifications"
        title="Credentials & Registrations"
        intro="Certification, registration and recognition documents, presented as issued — evidence of an established, compliant enterprise."
      />

      {/* ISO certifications */}
      <section className="container-edge py-16 md:py-24">
        <SectionLabel index="01" label="Quality, Safety & Environment" />
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight uppercase max-w-2xl">
          ISO certifications
        </h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {certifications.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setCertIndex(i)}
              className="text-left group border border-concrete hover:border-rust transition-colors"
            >
              <div className="aspect-[4/3] overflow-hidden border-b border-concrete bg-ivory">
                <img src={c.image} alt={c.standard} className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-6">
                <span className="label-eyebrow text-rust">{c.pillar}</span>
                <p className="mt-2 font-semibold">{c.standard}</p>
                <p className="mt-1 text-sm text-steel">{c.name}</p>
                <p className="mt-3 text-xs text-steel leading-relaxed">{c.scope}</p>
                <p className="mt-4 label-eyebrow text-rust">View Certificate →</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Statutory registrations */}
      <section className="bg-ivory border-y border-concrete">
        <div className="container-edge py-16 md:py-24">
          <SectionLabel index="02" label="Registered & Compliant" />
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight uppercase max-w-2xl">
            Statutory registrations
          </h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {statutoryRegistrations.map((r, i) => (
              <button
                key={r.id}
                onClick={() => setRegIndex(i)}
                className="text-left border border-concrete hover:border-rust transition-colors p-6 bg-paper"
              >
                <p className="font-semibold">{r.title}</p>
                <p className="mt-2 text-sm text-steel leading-relaxed">{r.detail}</p>
                <p className="mt-4 label-eyebrow text-rust">View Document →</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Completion certificate */}
      <section className="container-edge py-16 md:py-24">
        <SectionLabel index="03" label="Project Credentials" />
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight uppercase max-w-2xl">
          Completion certificate
        </h2>
        <button
          onClick={() => setShowCompletion(true)}
          className="mt-10 w-full text-left grid grid-cols-1 md:grid-cols-12 gap-6 border border-concrete hover:border-rust transition-colors p-6 md:p-8"
        >
          <div className="md:col-span-8">
            <p className="font-semibold">{completionCertificate.title}</p>
            <p className="mt-1 text-sm text-steel">{completionCertificate.issuer}</p>
            <p className="mt-4 text-sm text-charcoal/80 leading-relaxed">{completionCertificate.detail}</p>
            <div className="mt-6 flex flex-wrap gap-8">
              <div>
                <p className="label-eyebrow text-steel">Work Order Value</p>
                <p className="mt-1 font-mono">{completionCertificate.workOrderValue}</p>
              </div>
              <div>
                <p className="label-eyebrow text-steel">Executed Value</p>
                <p className="mt-1 font-mono">{completionCertificate.executedValue}</p>
              </div>
              <div>
                <p className="label-eyebrow text-steel">Contract Period</p>
                <p className="mt-1">{completionCertificate.contractPeriod}</p>
              </div>
            </div>
          </div>
          <div className="md:col-span-4 flex items-center">
            <span className="label-eyebrow text-rust">View Certificate →</span>
          </div>
        </button>
      </section>

      {/* Awards */}
      <section className="bg-charcoal text-ivory">
        <div className="container-edge py-16 md:py-24">
          <SectionLabel index="04" label="Awards & Achievements" />
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight uppercase max-w-2xl text-white">
            Recognized by our clients
          </h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {awards.map((a, i) => (
              <button
                key={a.id}
                onClick={() => setAwardIndex(i)}
                className="text-left border border-ivory/15 hover:border-rust-light transition-colors p-6"
              >
                <p className="label-eyebrow text-rust-light">{a.period}</p>
                <p className="mt-3 font-semibold">{a.title}</p>
                <p className="mt-1 text-sm text-ivory/60">{a.issuer}</p>
                <p className="mt-4 text-sm text-ivory/75 leading-relaxed">{a.detail}</p>
                <p className="mt-4 label-eyebrow text-rust-light">View Certificate →</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <Lightbox items={certLightboxItems} index={certIndex} onClose={() => setCertIndex(null)} onNavigate={setCertIndex} />
      <Lightbox items={regLightboxItems} index={regIndex} onClose={() => setRegIndex(null)} onNavigate={setRegIndex} />
      <Lightbox items={awardLightboxItems} index={awardIndex} onClose={() => setAwardIndex(null)} onNavigate={setAwardIndex} />
      <Lightbox
        items={[{ image: completionCertificate.image, title: completionCertificate.title, subtitle: completionCertificate.issuer }]}
        index={showCompletion ? 0 : null}
        onClose={() => setShowCompletion(false)}
        onNavigate={() => {}}
      />
    </>
  );
}
