import { useEffect, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { nav, company } from "../data/company";
import { telLink } from "../lib/whatsapp";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors ${
        scrolled
          ? "bg-paper/95 border-concrete backdrop-blur"
          : "bg-paper border-transparent"
      }`}
    >
      <div className="container-edge flex h-16 md:h-20 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0" aria-label="Anand Techno-Fab LLP home">
          <img src="/images/logo.png" alt="Anand Techno-Fab LLP" className="h-9 md:h-11 w-auto" />
        </Link>

        <nav className="hidden lg:flex items-center gap-7 label-eyebrow text-charcoal/70">
          {nav.filter((n) => n.label !== "Home").map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `relative py-2 transition-colors hover:text-charcoal ${
                  isActive ? "text-charcoal" : ""
                }`
              }
            >
              {({ isActive }) => (
                <span className="relative">
                  {item.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-rust" />
                  )}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <a href={telLink(company.phones[0])} className="label-eyebrow text-charcoal/70 hover:text-charcoal">
            {company.phones[0]}
          </a>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-charcoal text-paper px-5 py-2.5 label-eyebrow hover:bg-rust transition-colors"
          >
            Contact Us
          </Link>
        </div>

        <div className="flex lg:hidden items-center gap-3">
          <a
            href={telLink(company.phones[0])}
            aria-label="Call Anand Techno-Fab"
            className="p-2 border border-charcoal/20 text-charcoal"
          >
            <PhoneIcon />
          </a>
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="p-2 border border-charcoal/20 text-charcoal"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-concrete bg-paper">
          <nav className="container-edge py-4 flex flex-col">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `py-3 border-b border-concrete/70 label-eyebrow ${
                    isActive ? "text-rust" : "text-charcoal/80"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Link
              to="/contact"
              className="mt-4 text-center bg-charcoal text-paper px-5 py-3 label-eyebrow"
            >
              Contact Us
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M2 5h16M2 10h16M2 15h16" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M4 3h3l1.5 4-2 1.5a10 10 0 0 0 5 5l1.5-2 4 1.5v3a1 1 0 0 1-1 1C10 17 3 10 3 4a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}
