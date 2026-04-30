'use client';
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageProvider';

export default function ContactSection() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to send message');
        return;
      }

      setSubmitted(true);
    } catch (err) {
      setError('An error occurred while sending the message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 lg:py-32 px-6 lg:px-10 max-w-7xl mx-auto">
      {/* Label */}
      <div className="mb-14 reveal">
        <span className="section-label block mb-2">{t('contact.frame')}</span>
        <h2 className="font-display text-3xl lg:text-4xl font-light text-titanium">
          {t('contact.titleP1')}
          <em className="not-italic text-signal-blue">{t('contact.titleP2')}</em>
        </h2>
        <p className="text-chromium mt-3 max-w-xl text-sm leading-relaxed">
          {t('contact.desc')}
        </p>
      </div>

      <div className="gallery-frame rounded-2xl overflow-hidden reveal reveal-delay-1">
        <div className="grid lg:grid-cols-5">
          {/* 60% — Form */}
          <div className="lg:col-span-3 p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-chromium/15">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-signal-blue/15 border-2 border-signal-blue/30 flex items-center justify-center mb-6">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M6 14l5.5 5.5L22 8" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="font-display text-2xl font-light text-titanium mb-3">
                  {t('contact.successTitle')}
                </h3>
                <p className="text-chromium text-sm max-w-xs leading-relaxed">
                  {t('contact.successDescP1')}{form.name}{t('contact.successDescP2')}
                  <span className="text-titanium">{form.email}</span>{t('contact.successDescP3')}
                </p>
                <div className="mt-8 pt-6 border-t border-chromium/15 w-full max-w-xs">
                  <p className="text-chromium/50 text-xs">
                    {t('contact.successWait')}
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                  </div>
                )}
                {/* Name + Email row */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="section-label block mb-2">{t('contact.formNameText')}</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      onFocus={() => setFocused('name')}
                      onBlur={() => setFocused('')}
                      placeholder={t('contact.formNamePlace')}
                      className="form-input w-full rounded-xl px-4 py-3 text-sm"
                    />
                  </div>
                  <div>
                    <label className="section-label block mb-2">{t('contact.formEmailText')}</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      onFocus={() => setFocused('email')}
                      onBlur={() => setFocused('')}
                      placeholder={t('contact.formEmailPlace')}
                      className="form-input w-full rounded-xl px-4 py-3 text-sm"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="section-label block mb-2">{t('contact.formSubjectText')}</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    onFocus={() => setFocused('subject')}
                    onBlur={() => setFocused('')}
                    placeholder={t('contact.formSubjectPlace')}
                    className="form-input w-full rounded-xl px-4 py-3 text-sm"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="section-label block mb-2">{t('contact.formMessageText')}</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    onFocus={() => setFocused('message')}
                    onBlur={() => setFocused('')}
                    placeholder={t('contact.formMessagePlace')}
                    className="form-input w-full rounded-xl px-4 py-3 text-sm resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="cta-pill w-full py-4 text-base font-semibold flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                        <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      {t('contact.btnSubmit')}
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </>
                  )}
                </button>
                <p className="text-chromium/40 text-xs text-center">
                  {t('contact.noSpam')}
                </p>
              </form>
            )}
          </div>

          {/* 40% — Contact info */}
          <div className="lg:col-span-2 bg-gunmetal-light p-8 lg:p-12 flex flex-col justify-between">
            <div>
              <div className="section-label mb-6">{t('contact.otherWays')}</div>
              <div className="space-y-5">
                {[
                  {
                    label: 'Email',
                    value: 'aliissayacouba7@gmail.com',
                    href: 'mailto:aliissayacouba7@gmail.com',
                    icon: (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <rect x="1" y="3" width="14" height="10" rx="1.5" stroke="#3B82F6" strokeWidth="1.2" />
                        <path d="M1 5l7 5 7-5" stroke="#3B82F6" strokeWidth="1.2" strokeLinecap="round" />
                      </svg>
                    ),
                  },
                  {
                    label: 'LinkedIn',
                    value: 'linkedin.com/in/yacoubaaliissa',
                    href: '#',
                    icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#3B82F6">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    ),
                  },
                  {
                    label: 'GitHub',
                    value: 'github.com/aliissayac',
                    href: 'https://github.com/aliissayac',
                    icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#3B82F6">
                        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                      </svg>
                    ),
                  },
                  {
                    label: 'Twitter / X',
                    value: '@aliissayacouba',
                    href: '#',
                    icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#3B82F6">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    ),
                  },
                ].map((contact) => (
                  <a
                    key={contact.label}
                    href={contact.href}
                    className="flex items-center gap-3 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-signal-blue/10 border border-signal-blue/20 flex items-center justify-center flex-shrink-0">
                      {contact.icon}
                    </div>
                    <div>
                      <div className="section-label">{contact.label}</div>
                      <div className="text-titanium text-sm font-medium group-hover:text-signal-blue transition-colors">
                        {contact.value}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Availability badge */}
            <div className="mt-8 pt-6 border-t border-chromium/15">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-signal-blue animate-pulse" />
                <span className="text-xs text-chromium/60 font-medium tracking-wider uppercase">
                  {t('contact.availabilityLabel')}
                </span>
              </div>
              <div className="text-titanium font-semibold text-sm mb-1">{t('contact.availabilityTitle')}</div>
              <p className="text-chromium/60 text-xs leading-relaxed">
                {t('contact.availabilityDescP1')}<span className="text-signal-blue">{t('contact.availabilityDescP2')}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
