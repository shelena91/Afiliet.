import { useState } from 'react';
import { getProdutos, getComissoes, saveComissao, updateComissao, deleteComissao, uid, formatBRL } from '../lib/storage';
import type { Comissao, StatusComissao } from '../types';
import PageHeader from '../components/PageHeader';

const STATUS_COLOR: Record<StatusComissao, string> = {
  Pendente: 'text-muted',
  Confirmada: 'text-thread',
  Cancelada: 'text-red-400/80',
};

export default function Comissoes() {
  const produtos = getProdutos();
  const [comissoes, setComissoes] = useState(getComissoes());
  const [aberto, setAberto] = useState(false);

  function refresh() {
    setComissoes(getComissoes());
  }

  const total = comissoes.filter(c => c.status !== 'Cancelada').reduce((s, c) => s + c.valorCentavos, 0);

  function ciclarStatus(c: Comissao) {
    const ordem: StatusComissao[] = ['Pendente', 'Confirmada', 'Cancelada'];
    const proximo = ordem[(ordem.indexOf(c.status) + 1) % ordem.length];
    updateComissao({ ...c, status: proximo });
    refresh();
  }

  return (
    <div>
      <PageHeader title="Comissões" subtitle={`Total: ${formatBRL(total)}`} />

      <button onClick={() => setAberto(true)} className="mb-5 w-full rounded-xl bg-flow py-3 text-sm font-medium text-ink">
        + Nova comissão
      </button>

      {comissoes.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-white/10 bg-surface/40 py-8 text-center text-sm text-muted">
          Registre suas comissões manualmente conforme a Shopee confirma os pedidos.
        </p>
      ) : (
        <ul className="space-y-2.5">
          {comissoes.map(c => {
            const produto = produtos.find(p => p.id === c.produtoId);
            return (
              <li key={c.id} className="rounded-xl bg-surface px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-paper">{produto?.nome ?? c.descricao}</p>
                    <p className="mt-0.5 text-xs text-muted">
                      {new Date(c.data + 'T00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <span className="shrink-0 font-mono text-sm text-paper">{formatBRL(c.valorCentavos)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <button onClick={() => ciclarStatus(c)} className={`text-xs font-medium ${STATUS_COLOR[c.status]}`}>
                    {c.status} · toque para mudar
                  </button>
                  <button onClick={() => { deleteComissao(c.id); refresh(); }} className="text-xs text-muted">
                    remover
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {aberto && (
        <NovaComissaoModal
          produtos={produtos}
          onClose={() => setAberto(false)}
          onSave={c => { saveComissao(c); refresh(); setAberto(false); }}
        />
      )}
    </div>
  );
}

function NovaComissaoModal({
  produtos,
  onClose,
  onSave,
}: {
  produtos: ReturnType<typeof getProdutos>;
  onClose: () => void;
  onSave: (c: Comissao) => void;
}) {
  const [produtoId, setProdutoId] = useState<string>('');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [data, setData] = useState(new Date().toISOString().slice(0, 10));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const produto = produtos.find(p => p.id === produtoId);
    if (!valor.trim() || (!produto && !descricao.trim())) return;
    onSave({
      id: uid(),
      produtoId: produtoId || undefined,
      descricao: descricao.trim() || produto?.nome || 'Comissão',
      valorCentavos: Math.round(parseFloat(valor.replace(',', '.') || '0') * 100),
      status: 'Pendente',
      data,
    });
  }

  return (
    <div className="fixed inset-0 z-30 flex items-end bg-black/60" onClick={onClose}>
      <form onSubmit={handleSubmit} onClick={e => e.stopPropagation()} className="w-full rounded-t-2xl bg-surface p-5 pb-8">
        <h2 className="mb-4 font-display text-lg font-600 text-paper">Nova comissão</h2>

        <label className="mb-3 block text-xs text-muted">
          Produto (opcional)
          <select value={produtoId} onChange={e => setProdutoId(e.target.value)} className="mt-1 w-full rounded-lg bg-surface2 px-3 py-2.5 text-sm text-paper outline-none">
            <option value="">— sem produto vinculado —</option>
            {produtos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
          </select>
        </label>

        {!produtoId && (
          <label className="mb-3 block text-xs text-muted">
            Descrição
            <input value={descricao} onChange={e => setDescricao(e.target.value)} className="mt-1 w-full rounded-lg bg-surface2 px-3 py-2.5 text-sm text-paper outline-none" placeholder="Ex: Pedido combo Moda Feminina" />
          </label>
        )}

        <label className="mb-3 block text-xs text-muted">
          Valor da comissão (R$)
          <input value={valor} onChange={e => setValor(e.target.value)} inputMode="decimal" className="mt-1 w-full rounded-lg bg-surface2 px-3 py-2.5 text-sm text-paper outline-none" placeholder="0,00" autoFocus />
        </label>

        <label className="mb-5 block text-xs text-muted">
          Data
          <input type="date" value={data} onChange={e => setData(e.target.value)} className="mt-1 w-full rounded-lg bg-surface2 px-3 py-2.5 text-sm text-paper outline-none" />
        </label>

        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 rounded-lg bg-surface2 py-2.5 text-sm text-muted">Cancelar</button>
          <button type="submit" className="flex-1 rounded-lg bg-flow py-2.5 text-sm font-medium text-ink">Salvar</button>
        </div>
      </form>
    </div>
  );
}
