"use client";

import { useState, type FormEvent } from "react";
import type { translations } from "../translations";

type ContactText = (typeof translations)["en"]["contact"] | (typeof translations)["el"]["contact"];

export default function ContactForm({
  text,
}: {
  text: ContactText;
}) {
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();
    if (!name || !email || !message) {
      setNotice(text.invalid);
      return;
    }

    setSubmitting(true);
    setNotice("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (!response.ok) {
        setNotice(response.status === 400 ? text.invalid : text.sendError);
        return;
      }

      formElement.reset();
      setNotice(text.sent);
    } catch {
      setNotice(text.sendError);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      className="contact-form"
      onSubmit={handleSubmit}
      onInput={() => setNotice("")}
    >
      <div className="contact-field-row">
        <div className="contact-field">
          <label htmlFor="contact-name">{text.name}</label>
          <div className="contact-input-shell">
            <svg className="contact-field-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <circle cx="10" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.4" />
              <path d="M4.5 16v-1.3a5.5 5.5 0 0 1 11 0V16" stroke="currentColor" strokeWidth="1.4" />
            </svg>
            <input id="contact-name" name="name" type="text" autoComplete="name" placeholder={text.namePlaceholder} maxLength={120} required />
          </div>
        </div>

        <div className="contact-field">
          <label htmlFor="contact-email">{text.email}</label>
          <div className="contact-input-shell">
            <svg className="contact-field-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <rect x="2.5" y="4.5" width="15" height="11" rx="1" stroke="currentColor" strokeWidth="1.4" />
              <path d="m3 5 7 5.5L17 5" stroke="currentColor" strokeWidth="1.4" />
            </svg>
            <input id="contact-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" maxLength={254} required />
          </div>
        </div>
      </div>

      <div className="contact-field contact-message-field">
        <label htmlFor="contact-message">{text.message}</label>
        <textarea id="contact-message" name="message" placeholder={text.messagePlaceholder} maxLength={5000} required />
      </div>

      <button className="contact-submit" type="submit" disabled={submitting}>
        {submitting ? text.sending : text.send}
      </button>
      <p className="contact-notice" role="status" aria-live="polite">
        {notice}
      </p>
    </form>
  );
}
