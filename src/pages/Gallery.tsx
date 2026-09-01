import { useMemo, useState } from "react";
import PageHero from "../components/PageHero";
import Lightbox from "../components/Lightbox";
import { galleryItems, type GalleryItem } from "../data/company";

const categories: ("All" | GalleryItem["category"])[] = [
  "All",
  "Water Pipeline",
  "Earthwork",
  "Mining",
  "Safety & People",
];

export default function Gallery() {
  const [filter, setFilter] = useState<(typeof categories)[number]>("All");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (filter === "All") return galleryItems;
    return galleryItems.filter((g) => g.category === filter);
  }, [filter]);

  const lightboxItems = filtered.map((g) => ({
    image: g.image,
    title: g.caption,
    subtitle: g.location,
  }));

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Field Photography"
        intro="Real project photography from active and completed sites — pipelines, earthwork, mining and the people executing the work."
      />

      <section className="container-edge py-16 md:py-24">
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`label-eyebrow px-4 py-2 border transition-colors ${
                filter === c
                  ? "bg-charcoal text-paper border-charcoal"
                  : "border-concrete text-steel hover:border-charcoal hover:text-charcoal"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Editorial layout: one large image + two supporting, repeated */}
        <div className="space-y-3">
          {chunk(filtered, 3).map((group, gi) => (
            <div key={gi} className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {group[0] && (
                <button
                  onClick={() => setOpenIndex(gi * 3)}
                  className="md:row-span-2 relative overflow-hidden group aspect-[4/3] md:aspect-auto"
                >
                  <img
                    src={group[0].image}
                    alt={group[0].caption}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <Caption item={group[0]} />
                </button>
              )}
              <div className="grid grid-rows-2 gap-3">
                {[group[1], group[2]].map(
                  (item, i) =>
                    item && (
                      <button
                        key={item.id}
                        onClick={() => setOpenIndex(gi * 3 + i + 1)}
                        className="relative overflow-hidden group aspect-[4/3]"
                      >
                        <img
                          src={item.image}
                          alt={item.caption}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <Caption item={item} />
                      </button>
                    )
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Lightbox items={lightboxItems} index={openIndex} onClose={() => setOpenIndex(null)} onNavigate={setOpenIndex} />
    </>
  );
}

function Caption({ item }: { item: GalleryItem }) {
  return (
    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/85 to-transparent p-4 text-left">
      <p className="text-white text-sm font-medium">{item.caption}</p>
      <p className="text-ivory/60 text-xs mt-0.5">{item.location}</p>
    </div>
  );
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}
