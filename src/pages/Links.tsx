import { useState } from 'react';
import { getProdutos, getLinks, saveLink, deleteLink, uid } from '../lib/storage';
import { PLATAFORMAS, type LinkAfiliado } from '../types';
import PageHeader from '../components/PageHeader';

export default function Links() {
  const produtos = getProdutos();
  const [links, setLinks] = useState(getLinks());
  const [aberto, setAberto] = useState(false);
  const [copiadoId, setCopiadoId] = useState<string | null>(null);

  function refresh() {
    setLinks(getLinks());
  }

  async function copiar(url: string, id: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopiadoId(id);
      setTimeout(() => setCopiadoId(null), 1500);
    } catch {
      /* clipboard indisponível — ignora silenciosamente */
    }
  }

  return (
    <div>
      <PageHeader title="Links de afiliado" subtitle={`${links.length} salvos`} />

      <button
        onClick={() => setAberto(true)}
        disabled={produtos.length === 0}
        className="mb-5 w-full rounded-xl bg-flow py-3 text-sm font-medium text-ink disabled:opacity-40"
      >
        + Novo link
      </button>
      {produtos.length === 0 && (
        <p className="-mt-3 mb-5 text-xs text-muted">Cadastre um produto antes de salvar um link.</p>
      )}

      {links.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-white/10 bg-surface/40 py-8 text-center text-sm text-muted">
          Gere o link no app da Shopee e cole aqui pra organizar por plataforma.
        </p>
      ) : (
        <ul className="space-y-2.5">
          {links.map(l => {
            const produto = produtos.find(p => p.id === l.produtoId);
            return (
              <li key={l.id} className="flow-thread rounded-xl bg-surface px-4 py-3 pl-5" style={{ '--thread-from': '#17B399', '--thread-to': '#17B399' } as React.CSSProperties}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-paper">{produto?.nome ?? 'Produto removido'}</p>
                    <p className="mt-0.5 text-xs text-muted">{l.plataforma}</p>
                  </div>
                  <button onClick={() => copiar(l.url, l.id)} className="shrink-0 text-xs font-medium text-thread">
                    {copiadoId === l.id ? 'copiado ✓' : 'copiar'}
                  </button>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <p className="truncate text-xs text-muted">{l.url}</p>
                  <button onClick={() => { deleteLink(l.id); refresh(); }} className="ml-3 shrink-0 text-xs text-muted">
                    remover
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {aberto && (
        <NovoLinkModal
          produtos={produtos}
          onClose={() => setAberto(false)}
          onSave={l => { saveLink(l); refresh(); setAberto(false); }}
        />
      )}
    </div>
  );
}

function NovoLinkModal({
  produtos,
  onClose,
  onSave,
}: {
  produtos: ReturnType<typeof getProdutos>;
  onClose: () => void;
  onSave: (l: LinkAfiliado) => void;
}) {
  const [produtoId, setProdutoId] = useState(produtos[0]?.id ?? '');
  const [plataforma, setPlataforma] = useState<string>(PLATAFORMAS[0]);
  const [url, setUrl] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim() || !produtoId) return;
    onSave({ id: uid(), produtoId, plataforma, url: url.trim(), criadoEm: new Date().toISOString() });
  }

  return (
    <div className="fixed inset-0 z-30 flex items-end bg-black/60" onClick={onClose}>
      <form onSubmit={handleSubmit} onClick={e => e.stopPropagation()} className="w-full rounded-t-2xl bg-surface p-5 pb-8">
        <h2 className="mb-4 font-display text-lg font-600 text-paper">Novo link</h2>

        <label className="mb-3 block text-xs text-muted">
          Produto
          <select value={produtoId} onChange={e => setProdutoId(e.target.value)} className="mt-1 w-full rounded-lg bg-surface2 px-3 py-2.5 text-sm text-paper outline-none">
            {produtos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
          </select>
        </label>

        <label className="mb-3 block text-xs text-muted">
          Plataforma
          <select value={plataforma} onChange={e => setPlataforma(e.target.value)} className="mt-1 w-full rounded-lg bg-surface2 px-3 py-2.5 text-sm text-paper outline-none">
            {PLATAFORMAS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </label>

        <label className="mb-5 block text-xs text-muted">
          Link de afiliado (gerado na Shopee)
          <input value={url} onChange={e => setUrl(e.target.value)} className="mt-1 w-full rounded-lg bg-surface2 px-3 py-2.5 text-sm text-paper outline-none" placeholder="https://s.shopee.com.br/..." autoFocus />
        </label>

        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 rounded-lg bg-surface2 py-2.5 text-sm text-muted">Cancelar</button>
          <button type="submit" className="flex-1 rounded-lg bg-thread py-2.5 text-sm font-medium text-ink">Salvar</button>
        </div>
      </form>
    </div>
  );
            }
