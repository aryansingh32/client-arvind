import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import defaultContentJson from "../data/defaultContent.json";

// The full editable-site-content shape. Loosely typed on purpose: the admin
// panel's generic editors work off whatever keys/shapes exist in the JSON,
// so a new field an admin adds doesn't require a type change here.
export type SiteContent = typeof defaultContentJson;

const defaultContent = defaultContentJson as SiteContent;

interface ContentContextValue {
  content: SiteContent;
  ready: boolean;
  refresh: () => void;
  setLocal: (key: string, value: unknown) => void;
}

const ContentContext = createContext<ContentContextValue>({
  content: defaultContent,
  ready: false,
  refresh: () => {},
  setLocal: () => {},
});

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [ready, setReady] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/content")
      .then((res) => (res.ok ? res.json() : null))
      .then((fetched: Partial<SiteContent> | null) => {
        if (cancelled) return;
        if (fetched && Object.keys(fetched).length > 0) {
          setContent((prev) => ({ ...prev, ...fetched }));
        }
      })
      .catch(() => {
        // Offline / functions not running (e.g. plain `vite dev`) — keep bundled defaults.
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [tick]);

  const setLocal = (key: string, value: unknown) => {
    setContent((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <ContentContext.Provider value={{ content, ready, refresh: () => setTick((t) => t + 1), setLocal }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent(): SiteContent {
  return useContext(ContentContext).content;
}

export function useContentReady(): boolean {
  return useContext(ContentContext).ready;
}

export function useContentRefresh(): () => void {
  return useContext(ContentContext).refresh;
}

// Patches the in-memory content immediately after a confirmed admin save,
// instead of refetching /api/content — which carries a short cache-control
// window for public-visitor performance and would otherwise read back the
// stale cached response right after the write.
export function useContentSetLocal(): (key: string, value: unknown) => void {
  return useContext(ContentContext).setLocal;
}
