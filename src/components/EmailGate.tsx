import { useState, type FormEvent } from 'react';

const ALLOWED_EMAIL = 'slhelena48@gmail.com';
const STORAGE_KEY = 'shopeeflow:auth-email';

export function isUnlocked(): boolean {
  return localStorage.getItem(STORAGE_KEY) === ALLOWED_EMAIL;
}

export default function EmailGate({ onUnlock }: { onUnlock: () => void }) {
  const [email, setEmail] = useState('');
  const [erro, setErro] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const normalizado = email.trim().toLowerCase();
    if (normalizado === ALLOWED_EMAIL) {
      localStorage.setItem(STORAGE_KEY, normalizado);
      onUnlock();
    } else {
      setErro(true);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-xs">
        <h1 className="mb-1 font-display text-2xl font-600 text-paper">ShopeeFlow</h1>
        <p className="mb-6 text-sm text-muted">Digite seu e-mail para entrar</p>

        <input
          type="email"
          value={email}
          onChange={e => { setEmail(e.target.value); setErro(false); }}
          placeholder="seu@email.com"
          autoFocus
          className="w-full rounded-lg bg-surface2 px-3 py-2.5 text-sm text-paper outline-none"
        />
        {erro && <p className="mt-2 text-xs text-red-400">E-mail não autorizado.</p>}

        <button type="submit" className="mt-4 w-full rounded-lg bg-flow py-2.5 text-sm font-medium text-ink">
          Entrar
        </button>
      </form>
    </div>
  );
}
