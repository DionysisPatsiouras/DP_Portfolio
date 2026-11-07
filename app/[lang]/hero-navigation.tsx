"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";
import type { Language } from "./translations";

type SectionId = "about" | "services" | "projects" | "contact";

type NavigationItem = {
  id: SectionId;
  label: string;
};

function NavigationIcon({ id }: { id: SectionId }) {
  const icon = {
    about: (
      <>
        <circle cx="12" cy="8" r="3.25" />
        <path d="M5.5 20v-1.5a6.5 6.5 0 0 1 13 0V20" />
      </>
    ),
    services: (
      <>
        <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
      </>
    ),
    projects: (
      <path d="M3.5 7.5V6a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2V7.5Z" />
    ),
    contact: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m4 7 8 6 8-6" />
      </>
    ),
  }[id];

  return (
    <svg
      className="hero-navigation-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {icon}
    </svg>
  );
}

export default function HeroNavigation({
  items,
  className,
  label,
  lang,
}: {
  items: readonly NavigationItem[];
  className: string;
  label: string;
  lang: Language;
}) {
  const currentSection = useSelectedLayoutSegment() ?? "about";
  const navigationRef = useRef<HTMLElement>(null);
  const [indicatorPosition, setIndicatorPosition] = useState<{
    left: number;
    top: number;
  } | null>(null);

  useLayoutEffect(() => {
    const navigation = navigationRef.current;
    if (!navigation) return;

    const activeLink = navigation.querySelector<HTMLElement>(
      '.hero-navigation-link[aria-current="page"]',
    );
    if (!activeLink) return;

    const updateIndicator = () => {
      setIndicatorPosition({
        left: activeLink.offsetLeft + activeLink.offsetWidth / 2,
        top: activeLink.offsetTop,
      });
    };

    updateIndicator();

    const resizeObserver = new ResizeObserver(updateIndicator);
    resizeObserver.observe(navigation);
    navigation.querySelectorAll(".hero-navigation-link").forEach((link) => {
      resizeObserver.observe(link);
    });

    return () => resizeObserver.disconnect();
  }, [currentSection, items]);

  return (
    <nav
      ref={navigationRef}
      className={className}
      aria-label={label}
      data-active-section={currentSection}
      data-indicator-ready={indicatorPosition ? "" : undefined}
    >
      {items.map((item) => (
        <Link
          key={item.id}
          href={item.id === "about" ? `/${lang}` : `/${lang}/${item.id}`}
          className="hero-navigation-link"
          aria-current={currentSection === item.id ? "page" : undefined}
        >
          <NavigationIcon id={item.id} />
          <span className="hero-navigation-label">{item.label}</span>
        </Link>
      ))}
      <span
        className="hero-navigation-indicator"
        aria-hidden="true"
        style={
          indicatorPosition
            ? {
                left: indicatorPosition.left,
                top: `calc(${indicatorPosition.top}px + var(--indicator-offset))`,
              }
            : undefined
        }
      />
    </nav>
  );
}
