import Link from "next/link";
import { notFound } from "next/navigation";
import { isLanguage, translations } from "./translations";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();

  const text = translations[lang].about;

  return (
    <section className="about-section" aria-labelledby="about-heading">
      <div className="about-inner">
        <h1 id="about-heading" className="about-name">
          <span className="about-name-first">DIONYSIS</span>
          <span className="about-name-last">PATSIOURAS</span>
        </h1>

        <p className="about-role">SOFTWARE ENGINEER</p>
        <p className="about-specialties">{text.specialties.join(" / ")}</p>

        <div className="about-actions">
          <Link className="about-action about-action-primary" href={`/${lang}/contact`}>
            <span className="icon icon-phone" aria-hidden="true" />
            <span>{text.talk}</span>
          </Link>
          <a
            className="about-action about-action-secondary"
            href="/dionysis-patsiouras-cv.pdf"
            aria-label={text.resumeOpenLabel}
            title={text.resumeOpenLabel}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>{text.resume}</span>
            <span className="about-arrow" aria-hidden="true">→</span>
          </a>
        </div>

        <div className="about-copy">
          <p>{text.welcome}</p>
          <p>{text.description}</p>
          <p>{text.invitation}</p>
        </div>
      </div>
    </section>
  );
}
