"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

export default function ServicesScroller({
  children,
  label,
  previousLabel,
  nextLabel,
}: {
  children: ReactNode;
  label: string;
  previousLabel: string;
  nextLabel: string;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState({
    hasOverflow: false,
    canGoUp: false,
    canGoDown: false,
  });

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const updateScrollState = () => {
      const remaining = list.scrollHeight - list.clientHeight;
      setScrollState({
        hasOverflow: remaining > 2,
        canGoUp: list.scrollTop > 2,
        canGoDown: list.scrollTop < remaining - 2,
      });
    };

    updateScrollState();
    list.addEventListener("scroll", updateScrollState, { passive: true });

    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(list);
    Array.from(list.children).forEach((child) => resizeObserver.observe(child));

    return () => {
      list.removeEventListener("scroll", updateScrollState);
      resizeObserver.disconnect();
    };
  }, []);

  const scroll = (direction: -1 | 1) => {
    const list = listRef.current;
    if (!list) return;

    list.scrollBy({
      top: direction * 144,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };

  return (
    <div className="services-scroll-frame">
      <div
        ref={listRef}
        className="services-list"
        role="region"
        aria-label={label}
        data-can-scroll-down={scrollState.canGoDown ? "" : undefined}
        tabIndex={scrollState.hasOverflow ? 0 : -1}
      >
        {children}
      </div>
      <div className="services-scroll-controls" hidden={!scrollState.hasOverflow}>
        <button
          type="button"
          aria-label={previousLabel}
          disabled={!scrollState.canGoUp}
          onClick={() => scroll(-1)}
        >
          <svg viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="m3 11 6-6 6 6" />
          </svg>
        </button>
        <button
          className="services-scroll-down"
          type="button"
          aria-label={nextLabel}
          disabled={!scrollState.canGoDown}
          onClick={() => scroll(1)}
        >
          <svg viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="m3 11 6-6 6 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
