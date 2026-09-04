import { Link } from "react-router-dom";
import { company, nav } from "../data/company";
import { mailLink, telLink } from "../lib/whatsapp";

export default function Footer() {
  return (
    <footer className="bg-charcoal text-ivory/80">
      <div className="container-edge py-14 md:py-16 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
        <div className="md:col-span-5">
          <img
            src="/images/logo.png"
            alt="Anand Techno-Fab LLP"
            className="h-10 w-auto mb-4"
            loading="lazy"
            decoding="async"
          />
          <p className="text-ivory text-lg font-medium">{company.legalName}</p>
          <p className="mt-1 text-sm text-ivory/60">{company.tagline}</p>
          <p className="mt-6 text-sm leading-relaxed max-w-sm text-ivory/60">
            Infrastructure execution across water pipeline projects, structural
            fabrication &amp; erection, earthwork, mining and quarry plant
            operations.
          </p>
        </div>

        <div className="md:col-span-3">
          <p className="label-eyebrow text-ivory/40 mb-4">Navigate</p>
          <ul className="space-y-2.5 text-sm">
            {nav.filter((n) => n.label !== "Home").map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="hover:text-rust-light transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-4">
          <p className="label-eyebrow text-ivory/40 mb-4">Contact</p>
          <ul className="space-y-2.5 text-sm">
            <li>{company.cityState}</li>
            <li className="text-ivory/60">{company.registeredAddress}</li>
            <li>
              <a href={mailLink(company.emails[0])} className="hover:text-rust-light transition-colors">
                {company.emails[0]}
              </a>
            </li>
            {company.phones.map((p) => (
              <li key={p}>
                <a href={telLink(p)} className="hover:text-rust-light transition-colors">
                  +91 {p}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-ivory/10">
        <div className="container-edge py-5 flex flex-col md:flex-row gap-2 md:gap-6 items-start md:items-center justify-between text-xs text-ivory/40">
          <p>© {new Date().getFullYear()} Anand Techno-Fab LLP. All rights reserved.</p>
          <p>LLP Identity No. {company.llpIdentityNo} · GST {company.gstNo}</p>
        </div>
      </div>
    </footer>
  );
}
