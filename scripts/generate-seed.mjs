// Regenerates migrations/0002_seed.sql and src/data/defaultContent.json from
// src/data/company.ts plus the copy blocks extracted from page JSX.
//
// Run: node scripts/generate-seed.mjs
// (bundles company.ts with esbuild first so this script has no ts-node dep)

import { execSync } from "node:child_process";
import { writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const tmpFile = join(mkdtempSync(join(tmpdir(), "seed-")), "company.mjs");
execSync(`npx esbuild ${join(root, "src/data/company.ts")} --bundle --format=esm --outfile=${tmpFile}`, {
  stdio: "inherit",
});
const companyData = await import(`file://${tmpFile}`);

const {
  company,
  nav,
  timeline,
  specializations,
  methodology,
  hsePolicy,
  qualityPolicy,
  commitment,
  team,
  equipment,
  equipmentHighlights,
  concurrentCommitments,
  projects,
  projectFilters,
  financials,
  certifications,
  statutoryRegistrations,
  awards,
  completionCertificate,
  galleryItems,
  financialNote,
} = companyData;

// New copy blocks — every previously-hardcoded JSX string, extracted verbatim
// from the current pages so nothing changes visually on first deploy.
const siteSettings = {
  logo: "/images/logo.png",
  heroVideo: "/videos/hero-placeholder.mp4",
  heroPoster: "/images/gallery/kalisindh-trench.jpg",
  heroVideoAlt: "Anand Techno-Fab project sites — pipeline installation, earthwork and mining operations",
  introEnabled: true,
  motionEnabled: true,
  navCtaLabel: "Contact Us",
  certBarItems: ["ISO 9001:2015", "ISO 14001:2015", "ISO 18001:2007 Certified"],
};

const home = {
  heroEyebrow: "Anand Techno-Fab LLP · Ahmedabad, Gujarat",
  heroHeadlineLine1: "Engineering Infrastructure.",
  heroHeadlineLine2: "Delivering With Precision.",
  heroIntro:
    "Infrastructure development and execution across water pipeline projects, structural fabrication & erection, earthwork, mining and related operations.",
  heroCtaPrimaryLabel: "Explore Our Capabilities",
  heroCtaPrimaryTo: "/capabilities",
  heroCtaSecondaryLabel: "View Projects",
  heroCtaSecondaryTo: "/projects",
  scrollLabel: "Scroll",
  stats: [
    { value: "20+", label: "Years of Field Experience" },
    { value: "15", label: "Project References in Profile" },
    { value: "145+", label: "Skilled Contractual Workforce" },
    { value: "3", label: "ISO Certifications Held" },
  ],
  sections: {
    about: {
      eyebrowIndex: "01",
      eyebrowLabel: "About",
      heading: "Two decades of building\nIndia's infrastructure",
      body: "We started our journey in 2004 with the name Anand Construction, providing services in water pipeline projects and structural fabrication. With years of experience and sustainable growth, the venture was incorporated as Anand Techno-Fab LLP in 2018 to continue the journey in infrastructure development & solutions across irrigation, structural fabrication & erection, earthwork and mining.",
      linkLabel: "Read our full story",
    },
    services: {
      eyebrowIndex: "02",
      eyebrowLabel: "Specializations",
      heading: "Built for complex project execution",
      linkLabel: "All services",
    },
    projects: {
      eyebrowIndex: "03",
      eyebrowLabel: "Project Experience",
      heading: "Selected project experience",
      linkLabel: "View all 15 projects",
    },
    capability: {
      eyebrowIndex: "04",
      eyebrowLabel: "Execution Capability",
      heading: "A fleet built for scale",
      linkLabel: "View complete equipment",
    },
    quality: {
      eyebrowIndex: "05",
      eyebrowLabel: "Quality, Safety & Environment",
      heading: "Certified across quality, safety and environment",
    },
    photography: {
      eyebrowIndex: "06",
      eyebrowLabel: "Field Execution",
      heading: "Grounded in real field work",
      linkLabel: "View full gallery",
      items: [
        { image: "/images/gallery/kalisindh-aerial.jpg", caption: "Kalisindh Phase-I, MLIS — Dewas, Madhya Pradesh" },
        { image: "/images/gallery/sauni-earthwork.jpg", caption: "Earthwork Excavation — SAUNI Yojana L3P3, Gujarat" },
        { image: "/images/gallery/mining-jafrabad-1.jpg", caption: "Mining Operations — Jafrabad, Amreli" },
      ],
    },
    recognition: {
      eyebrowIndex: "07",
      eyebrowLabel: "Recognition",
      heading: "Recognized by our clients",
      linkLabel: "All certifications & awards",
    },
    finalCta: {
      heading: "Have an infrastructure project in mind?",
      body: "Let's discuss your requirement.",
      ctaPrimaryLabel: "Start a Conversation",
      ctaSecondaryLabel: "WhatsApp Us",
      backgroundImage: "/images/gallery/welding-cta.jpg",
    },
  },
};

const pageHeroes = {
  about: {
    eyebrow: "About Us",
    title: "About Anand Techno-Fab",
    intro: "A team of young, dynamic and technically qualified personnel with 20 years of varied experience in infrastructure execution.",
  },
  services: {
    eyebrow: "Services",
    title: "What We Specialize In",
    intro: "We undertake turnkey projects across five core specializations, built on 20 years of varied field experience.",
  },
  projects: {
    eyebrow: "Projects",
    title: "Project Experience",
    intro: "Fifteen project references drawn from the company profile, executed for clients including L&T, Kalpataru, JMC and ESSAR.",
  },
  capabilities: {
    eyebrow: "Capabilities",
    title: "Execution Capacity",
    intro: "A dedicated technical team and a fleet of owned heavy machinery, deployed across concurrent project sites.",
  },
  qualitySafety: {
    eyebrow: "Quality & Safety",
    title: "Quality, Safety & Environment",
    intro: "Our operating policies for health, safety, environment and quality management — applied consistently across every project site.",
  },
  certifications: {
    eyebrow: "Certifications",
    title: "Credentials & Registrations",
    intro: "Certification, registration and recognition documents, presented as issued — evidence of an established, compliant enterprise.",
  },
  gallery: {
    eyebrow: "Gallery",
    title: "Field Photography",
    intro: "Real project photography from active and completed sites — pipelines, earthwork, mining and the people executing the work.",
  },
  contact: {
    eyebrow: "Contact",
    title: "Let's Discuss Your Project",
    intro: "Reach us directly by phone, email or WhatsApp, or send a project enquiry using the form below.",
  },
};

const aboutContent = {
  journey: { eyebrowIndex: "01", eyebrowLabel: "Our Journey", heading: "From Anand Construction to Anand Techno-Fab LLP" },
  leadership: {
    eyebrowIndex: "02",
    eyebrowLabel: "Leadership",
    heading: "Hands-on leadership, on every site",
    body: "Anand Techno-Fab LLP is led by two partners — Mr. Amit Singh Rajput as Partner & CEO, and Mr. Suneel Kumar Singh as Partner & CFO. Together they carry the twenty years of field experience behind the company's journey from Anand Construction in 2004 to Anand Techno-Fab LLP today, overseeing execution, quality and client relationships across every concurrent project site.",
  },
  whatWeDo: { eyebrowIndex: "03", eyebrowLabel: "What We Do", heading: "An upcoming construction company undertaking turnkey projects" },
  approach: {
    eyebrowIndex: "04",
    eyebrowLabel: "Our Approach",
    heading: "How we work",
    body: "Our execution methodology, applied consistently across every project site.",
  },
  commitmentSection: { eyebrowIndex: "05", eyebrowLabel: "Commitment", heading: "Fully committed to excellence" },
  corporateDetails: { eyebrowIndex: "06", eyebrowLabel: "Company Information", heading: "Corporate details" },
};

const projectsContent = {
  concurrent: { eyebrowIndex: "01", eyebrowLabel: "Concurrent Commitments", heading: "Currently in execution" },
  archive: { eyebrowIndex: "02", eyebrowLabel: "Project Archive", heading: "Work experience" },
};

const capabilitiesContent = {
  team: { eyebrowIndex: "01", eyebrowLabel: "Execution Team", heading: "Our team", note: "Unskilled labour is deployed on a contractual basis as per site requirement." },
  equipment: { eyebrowIndex: "02", eyebrowLabel: "Technical Machinery", heading: "Equipment & technical capability", ctaLabel: "View Complete Equipment" },
  financials: { eyebrowIndex: "03", eyebrowLabel: "Financial Track Record", heading: "Last four years", show: true },
};

const qualitySafetyContent = {
  hse: { eyebrowIndex: "01", eyebrowLabel: "Health, Safety & Environment", heading: "Health, Safety & Environmental Policy", image: "/images/gallery/safety-training.jpg" },
  quality: { eyebrowIndex: "02", eyebrowLabel: "Quality Policy", heading: "Quality Policy", image: "/images/gallery/health-checkup-camp.jpg" },
  people: {
    eyebrowIndex: "03",
    eyebrowLabel: "Safety & People",
    heading: "Site discipline in practice",
    items: [
      { image: "/images/gallery/isp-kalisindh-workforce.jpg", caption: "Site workforce briefing — ISP-Kalisindh Ph-I, MLIS" },
      { image: "/images/gallery/safety-training.jpg", caption: "Field safety training session" },
      { image: "/images/gallery/health-checkup-camp.jpg", caption: "Health checkup camp — Kalisindh Phase 1, MLIS" },
    ],
  },
};

const certificationsContent = {
  iso: { eyebrowIndex: "01", eyebrowLabel: "Quality, Safety & Environment", heading: "ISO certifications" },
  statutory: { eyebrowIndex: "02", eyebrowLabel: "Registered & Compliant", heading: "Statutory registrations" },
  completion: { eyebrowIndex: "03", eyebrowLabel: "Project Credentials", heading: "Completion certificate" },
  awardsSection: { eyebrowIndex: "04", eyebrowLabel: "Awards & Achievements", heading: "Recognized by our clients" },
};

const contactContent = {
  enquiry: { eyebrowIndex: "01", eyebrowLabel: "Project Enquiry", heading: "Send a project enquiry" },
  office: { eyebrowIndex: "02", eyebrowLabel: "Registered Office", heading: "Visit us" },
  whatsappDefaultMessage: "Hello Anand Techno-Fab LLP, I would like to discuss a project requirement. Please let me know how we can proceed.",
};

const footerContent = {
  description: "Infrastructure execution across oil, gas & water pipeline projects, structural fabrication & erection, earthwork, mining and quarry plant operations.",
  ctaEyebrow: "Get In Touch",
  ctaHeading: "Let's engineer your next project.",
  ctaPrimaryLabel: "Start a Conversation",
  ctaSecondaryLabel: "WhatsApp Us",
  navigateHeading: "Navigate",
  contactHeading: "Contact",
};

const normalizedCompany = {
  ...company,
  partners: company.partners.map((p) => ({ photo: "", ...p })),
};

const content = {
  company: normalizedCompany,
  nav,
  timeline,
  specializations,
  methodology,
  hsePolicy,
  qualityPolicy,
  commitment,
  team,
  equipment,
  equipmentHighlights,
  concurrentCommitments,
  projects,
  projectFilters,
  financials,
  certifications,
  statutoryRegistrations,
  awards,
  completionCertificate,
  galleryItems,
  financialNote,
  siteSettings,
  home,
  pageHeroes,
  aboutContent,
  projectsContent,
  capabilitiesContent,
  qualitySafetyContent,
  certificationsContent,
  contactContent,
  footerContent,
};

// --- Write SQL seed migration ---
function sqlString(v) {
  return `'${JSON.stringify(v).replace(/'/g, "''")}'`;
}

let sql = `-- Auto-generated by scripts/generate-seed.mjs. Do not hand-edit — regenerate instead.\n-- Seeds the content table with the site's real launch content (from company.ts + page copy).\n\n`;
for (const [key, value] of Object.entries(content)) {
  sql += `INSERT OR REPLACE INTO content (key, value, updated_at) VALUES ('${key}', ${sqlString(value)}, datetime('now'));\n`;
}
writeFileSync(join(root, "migrations/0002_seed.sql"), sql);

// --- Write frontend default-content JSON (bundled fallback / initial paint) ---
writeFileSync(join(root, "src/data/defaultContent.json"), JSON.stringify(content, null, 2) + "\n");

console.log(`Wrote migrations/0002_seed.sql (${Object.keys(content).length} keys)`);
console.log("Wrote src/data/defaultContent.json");
