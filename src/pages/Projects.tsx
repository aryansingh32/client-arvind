import { useMemo, useState } from "react";
import PageHero from "../components/PageHero";
import SectionLabel from "../components/SectionLabel";
import {
  concurrentCommitments,
  projectFilters,
  projects,
  type Project,
} from "../data/company";

const projectImages: Record<string, string[]> = {
  "isp-kalisindh": [
    "/images/gallery/kalisindh-aerial.jpg",
    "/images/gallery/kalisindh-trench.jpg",
    "/images/gallery/isp-kalisindh-workforce.jpg",
  ],
  "sauni-l3p3": [
    "/images/gallery/sauni-earthwork.jpg",
    "/images/gallery/sauni-pipe-1.jpg",
    "/images/gallery/sauni-pipe-3.jpg",
  ],
};

export default function Projects() {
  const [filter, setFilter] = useState<(typeof projectFilters)[number]>("All");
  const [selected, setSelected] = useState<Project | null>(null);

  const filtered = useMemo(() => {
    if (filter === "All") return projects;
    return projects.filter((p) => p.categories.includes(filter as never));
  }, [filter]);

  return (
    <>
      <PageHero
        eyebrow="Projects"
        title="Project Experience"
        intro="Fifteen project references drawn from the company profile, executed for clients including L&T, Kalpataru, JMC and ESSAR."
      />

      {/* Concurrent commitments */}
      <section className="container-edge py-16 md:py-24">
        <SectionLabel index="01" label="Concurrent Commitments" />
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight uppercase max-w-2xl">
          Currently in execution
        </h2>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-px bg-concrete border border-concrete">
          {concurrentCommitments.map((c) => (
            <div key={c.title} className="bg-paper p-8">
              <p className="text-5xl md:text-6xl font-semibold tracking-tight text-rust">
                {c.diameter}
              </p>
              <p className="mt-4 font-semibold leading-snug">{c.title}</p>
              <p className="text-sm text-steel">{c.location}</p>
              <p className="mt-4 text-sm text-charcoal/80 leading-relaxed">{c.detail}</p>
              <div className="mt-6 flex gap-8 border-t border-concrete pt-4">
                <div>
                  <p className="label-eyebrow text-steel">Work Order Value</p>
                  <p className="mt-1 font-mono">{c.workOrderValue}</p>
                </div>
                <div>
                  <p className="label-eyebrow text-steel">Work Done</p>
                  <p className="mt-1 font-mono">{c.workDone}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Project archive */}
      <section className="bg-ivory border-y border-concrete">
        <div className="container-edge py-16 md:py-24">
          <SectionLabel index="02" label="Project Archive" />
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight uppercase max-w-xl">
              Work experience
            </h2>
            <div className="flex flex-wrap gap-2">
              {projectFilters.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`label-eyebrow px-4 py-2 border transition-colors ${
                    filter === f
                      ? "bg-charcoal text-paper border-charcoal"
                      : "border-concrete text-steel hover:border-charcoal hover:text-charcoal"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 border-t border-charcoal/15">
            <div className="hidden md:grid grid-cols-12 gap-4 py-3 label-eyebrow text-steel border-b border-charcoal/15">
              <span className="col-span-1">Year</span>
              <span className="col-span-5">Project</span>
              <span className="col-span-3">Location</span>
              <span className="col-span-1">Client</span>
              <span className="col-span-2 text-right">Value</span>
            </div>
            {filtered.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelected(p)}
                className="w-full text-left grid grid-cols-2 md:grid-cols-12 gap-2 md:gap-4 py-5 border-b border-charcoal/15 items-center hover:bg-paper transition-colors"
              >
                <span className="label-eyebrow text-rust md:col-span-1">{p.year}</span>
                <span className="col-span-2 md:col-span-5 font-medium">{p.title}</span>
                <span className="text-sm text-steel md:col-span-3">{p.location}</span>
                <span className="text-sm text-steel md:col-span-1">{p.client}</span>
                <span className="text-sm font-mono md:col-span-2 md:text-right">₹{p.workDoneCr} Cr</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="py-10 text-steel text-sm">No projects in this category.</p>
            )}
          </div>
        </div>
      </section>

      {selected && (
        <ProjectDetail project={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}

function ProjectDetail({ project, onClose }: { project: Project; onClose: () => void }) {
  const images = projectImages[project.id];
  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <button
        aria-label="Close project details"
        onClick={onClose}
        className="absolute inset-0 bg-charcoal/70"
      />
      <div className="relative w-full max-w-xl h-full bg-paper overflow-y-auto shadow-2xl animate-fade-up">
        <div className="sticky top-0 bg-paper border-b border-concrete flex items-center justify-between px-6 py-5">
          <span className="label-eyebrow text-rust">{project.year}</span>
          <button onClick={onClose} aria-label="Close" className="p-2 border border-concrete hover:border-charcoal">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-8">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight uppercase">{project.title}</h2>

          <div className="mt-6 grid grid-cols-2 gap-6 border-t border-b border-concrete py-6">
            <div>
              <p className="label-eyebrow text-steel">Location</p>
              <p className="mt-1">{project.location}</p>
            </div>
            <div>
              <p className="label-eyebrow text-steel">Client</p>
              <p className="mt-1">{project.client}</p>
            </div>
            <div>
              <p className="label-eyebrow text-steel">Year</p>
              <p className="mt-1">{project.year}</p>
            </div>
            <div>
              <p className="label-eyebrow text-steel">Work Done</p>
              <p className="mt-1 font-mono">₹{project.workDoneCr} Cr</p>
            </div>
          </div>

          <div className="mt-6">
            <p className="label-eyebrow text-steel mb-2">Category</p>
            <div className="flex flex-wrap gap-2">
              {project.categories.map((c) => (
                <span key={c} className="text-xs border border-concrete px-3 py-1.5 text-steel">
                  {c}
                </span>
              ))}
            </div>
          </div>

          {images && (
            <div className="mt-8 grid grid-cols-2 gap-3">
              {images.map((img) => (
                <img
                  key={img}
                  src={img}
                  alt={project.title}
                  className={`w-full object-cover ${img === images[0] ? "col-span-2 aspect-[16/9]" : "aspect-square"}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
