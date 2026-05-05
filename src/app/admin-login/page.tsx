'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.session?.access_token) {
        sessionStorage.setItem(
          'portfolio_admin_access_token',
          data.session.access_token
        );
      }

      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError('Une erreur inattendue est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--gunmetal)] transition-colors duration-300">
      <div className="w-full max-w-md p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[var(--titanium)] font-[Fraunces]">
            Admin Panel
          </h1>
          <p className="text-sm text-[var(--chromium)] mt-2">
            Connectez-vous pour gérer votre portfolio
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[var(--chromium)] mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-[var(--titanium)] placeholder-[var(--chromium)] focus:outline-none focus:ring-2 focus:ring-[var(--signal-blue)]/50 transition"
              placeholder="admin@example.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[var(--chromium)] mb-1">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-[var(--titanium)] placeholder-[var(--chromium)] focus:outline-none focus:ring-2 focus:ring-[var(--signal-blue)]/50 transition"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-lg bg-[var(--signal-blue)] text-white font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-[var(--signal-blue)]/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-[var(--chromium)]">
          <p>Accès réservé à l&apos;administrateur</p>
        </div>
      </div>
    </div>
  );
}
