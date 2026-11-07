import { notFound } from "next/navigation";
import ContactForm from "./contact-form";
import { isLanguage, translations } from "../translations";
import PageSignature from "../page-signature";

export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();

  const text = translations[lang];

  return (
    <section className="contact-section" aria-labelledby="contact-heading">
      <div className="page-title-group">
        <PageSignature />
        <h1 id="contact-heading" className="contact-heading">
          {text.nav.contact}
        </h1>
      </div>
      <p className="contact-intro">{text.contact.intro}</p>
      <ContactForm text={text.contact} />
    </section>
  );
}
