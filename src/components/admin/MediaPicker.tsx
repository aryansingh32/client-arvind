import { useEffect, useRef, useState } from "react";
import { listMedia, uploadMedia, type MediaItem } from "../../lib/adminApi";

export default function MediaPicker({
  value,
  onChange,
  kind = "image",
}: {
  value: string;
  onChange: (url: string) => void;
  kind?: "image" | "video";
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const item = await uploadMedia(file);
      onChange(item.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border border-neutral-700 bg-neutral-900 p-3 rounded">
      <div className="flex items-start gap-3">
        <div className="w-24 h-16 shrink-0 bg-neutral-800 rounded overflow-hidden flex items-center justify-center">
          {value ? (
            kind === "video" ? (
              <video src={value} className="w-full h-full object-cover" muted />
            ) : (
              <img src={value} alt="" className="w-full h-full object-cover" />
            )
          ) : (
            <span className="text-[10px] text-neutral-500">No file</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/images/example.jpg"
            className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1.5 text-xs text-neutral-100"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              disabled={uploading}
              className="text-xs px-2.5 py-1 bg-rust text-white rounded hover:bg-rust-dark disabled:opacity-50"
            >
              {uploading ? "Uploading…" : "Upload new"}
            </button>
            <button
              type="button"
              onClick={() => setShowLibrary(true)}
              className="text-xs px-2.5 py-1 border border-neutral-600 text-neutral-200 rounded hover:border-neutral-400"
            >
              Choose from library
            </button>
          </div>
          {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
        </div>
      </div>
      <input
        ref={fileInput}
        type="file"
        accept={kind === "video" ? "video/*" : "image/*"}
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {showLibrary && (
        <LibraryModal
          onPick={(url) => {
            onChange(url);
            setShowLibrary(false);
          }}
          onClose={() => setShowLibrary(false)}
        />
      )}
    </div>
  );
}

function LibraryModal({ onPick, onClose }: { onPick: (url: string) => void; onClose: () => void }) {
  const [items, setItems] = useState<MediaItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listMedia()
      .then((res) => setItems(res.items))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load media"));
  }, []);

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 p-6" onClick={onClose}>
      <div
        className="bg-neutral-900 border border-neutral-700 rounded-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-neutral-100">Media Library</p>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-100 text-sm">
            Close
          </button>
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        {!items && !error && <p className="text-sm text-neutral-400">Loading…</p>}
        {items && items.length === 0 && <p className="text-sm text-neutral-400">No uploads yet.</p>}
        {items && items.length > 0 && (
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onPick(item.url)}
                className="group aspect-square bg-neutral-800 rounded overflow-hidden border border-neutral-700 hover:border-rust relative"
              >
                {item.contentType.startsWith("video/") ? (
                  <video src={item.url} className="w-full h-full object-cover" muted />
                ) : (
                  <img src={item.url} alt={item.filename} className="w-full h-full object-cover" />
                )}
                <span className="absolute inset-x-0 bottom-0 bg-black/70 text-[9px] text-neutral-200 px-1 py-0.5 truncate">
                  {item.filename}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
