import { company } from "../data/company";

export function whatsappLink(message: string) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${company.whatsappNumber}?text=${encoded}`;
}

export const defaultWhatsappMessage =
  "Hello Anand Techno-Fab LLP, I would like to discuss a project requirement. Please let me know how we can proceed.";

export function buildEnquiryMessage(fields: {
  name: string;
  companyName: string;
  service: string;
  location: string;
  requirement: string;
}) {
  const { name, companyName, service, location, requirement } = fields;
  return [
    "Hello Anand Techno-Fab LLP,",
    "",
    `I am ${name || "[Name]"}${companyName ? ` from ${companyName}` : ""}.`,
    "",
    "I am looking for support regarding:",
    service || "[Service]",
    "",
    "Project Location:",
    location || "[Location]",
    "",
    "Project Requirement:",
    requirement || "[Requirement]",
    "",
    "Please let me know the next steps.",
    "",
    "Thank you.",
  ].join("\n");
}

export function telLink(phone: string) {
  return `tel:+91${phone}`;
}

export function mailLink(email: string) {
  return `mailto:${email}`;
}
