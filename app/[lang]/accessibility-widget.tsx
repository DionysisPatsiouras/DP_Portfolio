"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { Language } from "./translations";

type Option = "largeText" | "highContrast" | "underlineLinks" | "reducedMotion";
type Settings = Record<Option, boolean>;

const defaultSettings: Settings = {
  largeText: false,
  highContrast: false,
  underlineLinks: false,
  reducedMotion: false,
};
const storageKey = "dp-portfolio-accessibility";
const changeEvent = "dp-accessibility-change";

function getStoredValue() {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(storageKey);
  } catch {
    return null;
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(changeEvent, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(changeEvent, onChange);
  };
}

function parseSettings(value: string | null): Settings | null {
  try {
    const saved = JSON.parse(value ?? "null");
    if (saved && typeof saved === "object") {
      return {
        largeText: saved.largeText === true,
        highContrast: saved.highContrast === true,
        underlineLinks: saved.underlineLinks === true,
        reducedMotion: saved.reducedMotion === true,
      };
    }
  } catch {
    // Ignore invalid saved options.
  }
  return null;
}

const labels = {
  en: {
    title: "Accessibility",
    open: "Open accessibility options",
    close: "Close accessibility options",
    largeText: "Larger text",
    highContrast: "High contrast",
    underlineLinks: "Underline links",
    reducedMotion: "Reduce motion",
    reset: "Reset options",
  },
  el: {
    title: "Προσβασιμότητα",
    open: "Άνοιγμα επιλογών προσβασιμότητας",
    close: "Κλείσιμο επιλογών προσβασιμότητας",
    largeText: "Μεγαλύτερα γράμματα",
    highContrast: "Υψηλή αντίθεση",
    underlineLinks: "Υπογράμμιση συνδέσμων",
    reducedMotion: "Μείωση κίνησης",
    reset: "Επαναφορά επιλογών",
  },
} as const;

export default function AccessibilityWidget({ lang }: { lang: Language }) {
  const [open, setOpen] = useState(false);
  const [fallbackSettings, setFallbackSettings] = useState<Settings>(defaultSettings);
  const savedValue = useSyncExternalStore(subscribe, getStoredValue, () => null);
  const settings = useMemo(
    () => parseSettings(savedValue) ?? fallbackSettings,
    [savedValue, fallbackSettings],
  );
  const widgetRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const text = labels[lang];

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.a11yLargeText = String(settings.largeText);
    root.dataset.a11yHighContrast = String(settings.highContrast);
    root.dataset.a11yUnderlineLinks = String(settings.underlineLinks);
    root.dataset.a11yReducedMotion = String(settings.reducedMotion);
  }, [settings]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!widgetRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const update = (next: Settings) => {
    setFallbackSettings(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
      window.dispatchEvent(new Event(changeEvent));
    } catch {
      // The current page still reflects the selected options.
    }
  };

  const options: Option[] = ["largeText", "highContrast", "underlineLinks", "reducedMotion"];

  return (
    <div className="accessibility-widget" ref={widgetRef}>
      {open && (
        <div className="accessibility-panel" id="accessibility-options" role="group" aria-label={text.title}>
          <h2>{text.title}</h2>
          <div className="accessibility-options">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                className="accessibility-option"
                aria-pressed={settings[option]}
                onClick={() => update({ ...settings, [option]: !settings[option] })}
              >
                <span>{text[option]}</span>
                <span className="accessibility-switch" aria-hidden="true" />
              </button>
            ))}
          </div>
          <button className="accessibility-reset" type="button" onClick={() => update(defaultSettings)}>
            {text.reset}
          </button>
        </div>
      )}
      <button
        ref={triggerRef}
        className="accessibility-trigger"
        type="button"
        aria-label={open ? text.close : text.open}
        aria-controls={open ? "accessibility-options" : undefined}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" focusable="false">
          <circle cx="24" cy="24" r="21" stroke="currentColor" strokeWidth="3.5" />
          <circle cx="24" cy="12.5" r="3.5" fill="currentColor" />
          <path
            d="M12.5 17.2c-.8-.1-1.5.5-1.7 1.4-.2.9.4 1.7 1.3 1.9l8.3 1.5-.4 7.5-3.4 10.2c-.4 1.1.2 2.3 1.3 2.7 1.1.4 2.3-.2 2.7-1.3L24 32l3.4 9.1c.4 1.1 1.6 1.7 2.7 1.3 1.1-.4 1.7-1.6 1.3-2.7L28 29.5l-.4-7.5 8.3-1.5c.9-.2 1.5-1 1.3-1.9-.2-.9-.9-1.5-1.7-1.4L27 18.8h-6z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>
  );
}
