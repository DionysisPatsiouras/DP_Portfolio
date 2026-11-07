import type { Metadata } from "next";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import HeroNavigation from "./hero-navigation";
import LanguageSwitcher from "./language-switcher";
import { isLanguage, translations } from "./translations";
import "../globals.css";

const federo = localFont({
  src: "../fonts/Federo-Regular.ttf",
  weight: "400",
  display: "swap",
  fallback: ["Georgia", "serif"],
  variable: "--font-federo",
});

const josefinSans = localFont({
  src: "../fonts/JosefinSans-wght.ttf",
  weight: "100 700",
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});

const email = process.env.NEXT_PUBLIC_EMAIL
const github = process.env.NEXT_PUBLIC_GITHUB
const linkedin = process.env.NEXT_PUBLIC_LINKEDIN
const phone = process.env.NEXT_PUBLIC_PHONE

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "el" }];
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();

  return {
    title: translations[lang].pageTitle,
    description: translations[lang].pageDescription,
  };
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();

  const text = translations[lang];
  const navigation = [
    { id: "about", label: text.nav.about },
    { id: "services", label: text.nav.services },
    { id: "projects", label: text.nav.projects },
    { id: "contact", label: text.nav.contact },
  ] as const;

  return (
    <html lang={lang}>
      <body className={federo.variable}>
        <a className="skip-link" href="#main">
          {text.skipToContent}
        </a>
        <div className="portfolio-layout portfolio-hero" id="top">
          <svg
            className="hero-arcs"
            viewBox="0 0 982 632"
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M 982 279 A 392 392 0 0 1 756 632" />
            <path d="M 1011 358 A 294 294 0 0 1 827 632" />
            <path d="M 1057 374 A 276 276 0 0 1 884 632" />
          </svg>

          <header className="hero-chrome">
            <aside className="social-rail" aria-label={text.socialNavigation}>
              <span className="social-rail-line" aria-hidden="true" />
              <div className="social-rail-links">
                <a
                  href={github}
                  aria-label={text.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="icon icon-github" aria-hidden="true" />
                </a>
                <a
                  href={linkedin}
                  aria-label={text.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="icon icon-linkedin" aria-hidden="true" />
                </a>
              </div>
              <span className={`social-rail-caption ${josefinSans.className}`}>
                FOLLOW ME
              </span>
            </aside>

            <LanguageSwitcher lang={lang} chooseLanguage={text.chooseLanguage} />

            <div className="contact-shortcuts">
              <a
                href={phone ? `tel:${phone}` : `/${lang}/contact`}
                aria-label={phone ? text.callPhone : text.contactDetails}
              >
                <span className="icon icon-phone" aria-hidden="true" />
              </a>
              <a href={"mailto:" + email} aria-label={text.sendEmail}>
                <span className="icon icon-mail" aria-hidden="true" />
              </a>
            </div>

            <HeroNavigation
              items={navigation}
              className={`hero-navigation ${federo.className}`}
              label={text.navigation}
              lang={lang}
            />
          </header>

          <main id="main" className="page-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
