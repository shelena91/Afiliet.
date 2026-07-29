import { useMemo, useState } from 'react';
import { getProdutos, getPosts, savePost, updatePost, deletePost, uid } from '../lib/storage';
import { CATEGORIAS, PLATAFORMAS, TIPOS_CONTEUDO, type Categoria, type PostCalendario } from '../types';
import PageHeader from '../components/PageHeader';

export default function Calendario() {
  const produtos = getProdutos();
  const [posts, setPosts] = useState(getPosts());
  const [aberto, setAberto] = useState(false);

  function refresh() {
    setPosts(getPosts());
  }

  const grupos = useMemo(() => {
    const map = new Map<string, PostCalendario[]>();
    for (const p of posts) {
      const lista = map.get(p.data) ?? [];
      lista.push(p);
      map.set(p.data, lista);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [posts]);

  function alternarStatus(p: PostCalendario) {
    updatePost({ ...p, status: p.status === 'Pendente' ? 'Publicado' : 'Pendente' });
    refresh();
  }

  return (
    <div>
      <PageHeader title="Agenda de conteúdo" subtitle={`${posts.length} posts planejados`} />

      <button onClick={() => setAberto(true)} className="mb-5 w-full rounded-xl bg-flow py-3 text-sm font-medium text-ink">
        + Agendar post
      </button>

      {grupos.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-white/10 bg-surface/40 py-8 text-center text-sm text-muted">
          Nenhum post agendado. Planeje seu conteúdo do mês aqui.
        </p>
      ) : (
        <div className="space-y-5">
          {grupos.map(([data, itens]) => (
            <div key={data}>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">
                {new Date(data + 'T00:00').toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })}
              </p>
              <ul className="space-y-2.5">
                {itens.map(p => {
                  const produto = produtos.find(pr => pr.id === p.produtoId);
                  return (
                    <li key={p.id} className="flow-thread rounded-xl bg-surface px-4 py-3 pl-5" style={{ '--thread-from': '#F0521E', '--thread-to': '#17B399' } as React.CSSProperties}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-paper">{produto?.nome ?? p.categoria}</p>
                          <p className="mt-0.5 text-xs text-muted">{p.tipoConteudo} · {p.plataforma}</p>
                        </div>
                        <button
                          onClick={() => alternarStatus(p)}
                          className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                            p.status === 'Publicado' ? 'bg-thread-soft text-thread' : 'bg-flow-soft text-flow'
                          }`}
                        >
                          {p.status}
                        </button>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        {p.notas ? <p className="truncate text-xs text-muted">{p.notas}</p> : <span />}
                        <button onClick={() => { deletePost(p.id); refresh(); }} className="ml-3 shrink-0 text-xs text-muted">
                          remover
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}

      {aberto && (
        <NovoPostModal
          produtos={produtos}
          onClose={() => setAberto(false)}
          onSave={p => { savePost(p); refresh(); setAberto(false); }}
        />
      )}
    </div>
  );
}

function NovoPostModal({
  produtos,
  onClose,
  onSave,
}: {
  produtos: ReturnType<typeof getProdutos>;
  onClose: () => void;
  onSave: (p: PostCalendario) => void;
}) {
  const [data, setData] = useState(new Date().toISOString().slice(0, 10));
  const [produtoId, setProdutoId] = useState('');
  const [categoria, setCategoria] = useState<Categoria>('Outros');
  const [tipoConteudo, setTipoConteudo] = useState<string>(TIPOS_CONTEUDO[0]);
  const [plataforma, setPlataforma] = useState<string>(PLATAFORMAS[0]);
  const [notas, setNotas] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      id: uid(),
      data,
      produtoId: produtoId || undefined,
      categoria,
      tipoConteudo,
      plataforma,
      status: 'Pendente',
      notas: notas.trim() || undefined,
    });
  }

  return (
    <div className="fixed inset-0 z-30 flex items-end bg-black/60" onClick={onClose}>
      <form onSubmit={handleSubmit} onClick={e => e.stopPropagation()} className="max-h-[85vh] w-full overflow-y-auto rounded-t-2xl bg-surface p-5 pb-8">
        <h2 className="mb-4 font-display text-lg font-600 text-paper">Agendar post</h2>

        <label className="mb-3 block text-xs text-muted">
          Data
          <input type="date" value={data} onChange={e => setData(e.target.value)} className="mt-1 w-full rounded-lg bg-surface2 px-3 py-2.5 text-sm text-paper outline-none" autoFocus />
        </label>

        <label className="mb-3 block text-xs text-muted">
          Produto (opcional)
          <select value={produtoId} onChange={e => setProdutoId(e.target.value)} className="mt-1 w-full rounded-lg bg-surface2 px-3 py-2.5 text-sm text-paper outline-none">
            <option value="">— sem produto vinculado —</option>
            {produtos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
          </select>
        </label>

        <label className="mb-3 block text-xs text-muted">
          Categoria
          <select value={categoria} onChange={e => setCategoria(e.target.value as Categoria)} className="mt-1 w-full rounded-lg bg-surface2 px-3 py-2.5 text-sm text-paper outline-none">
            {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>

        <div className="mb-3 flex gap-3">
          <label className="block flex-1 text-xs text-muted">
            Formato
            <select value={tipoConteudo} onChange={e => setTipoConteudo(e.target.value)} className="mt-1 w-full rounded-lg bg-surface2 px-3 py-2.5 text-sm text-paper outline-none">
              {TIPOS_CONTEUDO.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
          <label className="block flex-1 text-xs text-muted">
            Plataforma
            <select value={plataforma} onChange={e => setPlataforma(e.target.value)} className="mt-1 w-full rounded-lg bg-surface2 px-3 py-2.5 text-sm text-paper outline-none">
              {PLATAFORMAS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </label>
        </div>

        <label className="mb-5 block text-xs text-muted">
          Notas (opcional)
          <input value={notas} onChange={e => setNotas(e.target.value)} className="mt-1 w-full rounded-lg bg-surface2 px-3 py-2.5 text-sm text-paper outline-none" placeholder="Ideia, ângulo, gancho..." />
        </label>

        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 rounded-lg bg-surface2 py-2.5 text-sm text-muted">Cancelar</button>
          <button type="submit" className="flex-1 rounded-lg bg-flow py-2.5 text-sm font-medium text-ink">Salvar</button>
        </div>
      </form>
    </div>
  );
      }
