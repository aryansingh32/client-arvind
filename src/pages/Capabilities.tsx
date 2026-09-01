import { useState } from "react";
import PageHero from "../components/PageHero";
import SectionLabel from "../components/SectionLabel";
import StatBlock from "../components/StatBlock";
import { team, equipment, equipmentHighlights, financials, financialNote } from "../data/company";

// Set to false to withdraw the Financial Track Record section from public view.
const SHOW_FINANCIALS = true;

export default function Capabilities() {
  const [showEquipment, setShowEquipment] = useState(false);
  const maxLakh = Math.max(...financials.map((f) => f.lakh));

  return (
    <>
      <PageHero
        eyebrow="Capabilities"
        title="Execution Capacity"
        intro="A dedicated technical team and a fleet of owned heavy machinery, deployed across concurrent project sites."
      />

      {/* Team */}
      <section className="container-edge py-16 md:py-24">
        <SectionLabel index="01" label="Execution Team" />
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight uppercase max-w-2xl">
          Our team
        </h2>
        <div className="mt-12 grid grid-cols-2 md:grid-cols-5 gap-x-8 gap-y-10">
          {team.map((t) => (
            <StatBlock key={t.label} value={String(t.count)} label={t.label} />
          ))}
        </div>
        <p className="mt-8 text-sm text-steel max-w-2xl">
          Unskilled labour is deployed on a contractual basis as per site requirement.
        </p>
      </section>

      {/* Equipment */}
      <section className="bg-charcoal text-ivory">
        <div className="container-edge py-16 md:py-24">
          <SectionLabel index="02" label="Technical Machinery" />
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight uppercase max-w-2xl text-white">
            Equipment &amp; technical capability
          </h2>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-8">
            {equipmentHighlights.map((e) => (
              <StatBlock key={e.label} dark value={String(e.count)} label={e.label} />
            ))}
          </div>

          <button
            onClick={() => setShowEquipment(true)}
            className="mt-10 inline-flex items-center gap-2 bg-rust text-white px-6 py-3 label-eyebrow hover:bg-rust-dark transition-colors"
          >
            View Complete Equipment
          </button>
        </div>
      </section>

      {/* Financial track record */}
      {SHOW_FINANCIALS && (
        <section className="container-edge py-16 md:py-24">
          <SectionLabel index="03" label="Financial Track Record" />
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight uppercase max-w-2xl">
            Last four years
          </h2>

          <div className="mt-12 flex items-end gap-4 md:gap-10 h-56 border-b border-charcoal/20">
            {financials.map((f) => (
              <div key={f.year} className="flex-1 flex flex-col items-center justify-end h-full">
                <span className="font-mono text-sm mb-2">₹{f.lakh.toFixed(2)}L</span>
                <div
                  className="w-full max-w-16 bg-rust/80"
                  style={{ height: `${(f.lakh / maxLakh) * 100}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-4 md:gap-10 mt-3">
            {financials.map((f) => (
              <div key={f.year} className="flex-1 text-center label-eyebrow text-steel max-w-16 md:max-w-none mx-auto">
                {f.year.replace("FY ", "")}
              </div>
            ))}
          </div>
          <p className="mt-8 text-xs text-steel max-w-xl">{financialNote}</p>
        </section>
      )}

      {showEquipment && <EquipmentDrawer onClose={() => setShowEquipment(false)} />}
    </>
  );
}

function EquipmentDrawer({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <button aria-label="Close equipment table" onClick={onClose} className="absolute inset-0 bg-charcoal/70" />
      <div className="relative w-full max-w-2xl h-full bg-paper overflow-y-auto shadow-2xl animate-fade-up">
        <div className="sticky top-0 bg-paper border-b border-concrete flex items-center justify-between px-6 py-5">
          <p className="font-semibold uppercase tracking-tight">Technical Machinery / Equipment</p>
          <button onClick={onClose} aria-label="Close" className="p-2 border border-concrete hover:border-charcoal">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-6">
          <div className="grid grid-cols-12 gap-2 py-3 label-eyebrow text-steel border-b border-charcoal/15">
            <span className="col-span-6">Equipment</span>
            <span className="col-span-2 text-right">Qty</span>
            <span className="col-span-2">Make</span>
            <span className="col-span-2">Condition</span>
          </div>
          {equipment.map((e) => (
            <div key={e.name} className="grid grid-cols-12 gap-2 py-3.5 border-b border-charcoal/10 text-sm items-center">
              <span className="col-span-6">{e.name}</span>
              <span className="col-span-2 text-right font-mono">{e.qty}</span>
              <span className="col-span-2 text-steel">{e.make}</span>
              <span className="col-span-2 text-steel">{e.condition}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
