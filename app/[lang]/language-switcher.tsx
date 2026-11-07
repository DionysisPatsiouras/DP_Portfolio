"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import type { Language } from "./translations";

type LanguageSwitcherProps = {
  lang: Language;
  chooseLanguage: string;
};

export default function LanguageSwitcher({
  lang,
  chooseLanguage,
}: LanguageSwitcherProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();
  const pathSuffix = pathname.replace(/^\/(?:en|el)(?=\/|$)/, "");
  const closeMenu = () => {
    if (detailsRef.current) detailsRef.current.open = false;
  };

  return (
    <details className="language-switcher" ref={detailsRef}>
      <summary title={chooseLanguage}>
        <span className="icon icon-globe" aria-hidden="true" />
        <span className="visually-hidden">{chooseLanguage}</span>
      </summary>
      <nav className="language-menu" aria-label={chooseLanguage}>
        <Link
          href={`/en${pathSuffix}`}
          hrefLang="en"
          lang="en"
          aria-current={lang === "en" ? "page" : undefined}
          onClick={closeMenu}
        >
          English
        </Link>
        <Link
          href={`/el${pathSuffix}`}
          hrefLang="el"
          lang="el"
          aria-current={lang === "el" ? "page" : undefined}
          onClick={closeMenu}
        >
          Ελληνικά
        </Link>
      </nav>
    </details>
  );
}
