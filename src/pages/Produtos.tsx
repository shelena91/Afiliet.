import { useState } from 'react';
import { getProdutos, saveProduto, deleteProduto, uid, formatBRL } from '../lib/storage';
import { CATEGORIAS, type Categoria, type Produto } from '../types';
import PageHeader from '../components/PageHeader';

export default function Produtos() {
  const [produtos, setProdutos] = useState(getProdutos());
  const [aberto, setAberto] = useState(false);

  function refresh() {
    setProdutos(getProdutos());
  }

  return (
    <div>
      <PageHeader title="Produtos" subtitle={`${produtos.length} cadastrados`} />

      <button
        onClick={() => setAberto(true)}
        className="mb-5 w-full rounded-xl bg-flow py-3 text-sm font-medium text-ink"
      >
        + Novo produto
      </button>

      {produtos.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-white/10 bg-surface/40 py-8 text-center text-sm text-muted">
          Nenhum produto ainda. Cole o link de um produto Shopee para começar.
        </p>
      ) : (
        <ul className="space-y-2.5">
          {produtos.map(p => (
            <li key={p.id} className="flow-thread rounded-xl bg-surface px-4 py-3 pl-5" style={{ '--thread-from': '#F0521E', '--thread-to': '#F0521E' } as React.CSSProperties}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-paper">{p.nome}</p>
                  <p className="mt-0.5 text-xs text-muted">{p.categoria}</p>
                </div>
                <span className="shrink-0 font-mono text-sm text-thread">{formatBRL(p.precoCentavos)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <a href={p.linkProduto} target="_blank" rel="noreferrer" className="truncate text-xs text-flow underline underline-offset-2">
                  abrir link do produto
                </a>
                </a>

                        <button
                          onClick={() =>
                            enviarParaFilaDeAnuncios({
                              nome: p.nome,
                              linkAfiliado: p.linkProduto,
                              preco: String(p.precoCentavos),
                              imagemUrl: p.imagemUrl ?? "",
                              textoAnuncio: p.nome,
                            })
                          }
                          className="botao-anuncio"
                        >
                          Enviar pra fila de anúncios
                        </button>

                      </div>
                    </li>
                  ))}
                </ul>
              )}
          
                          onClick={() =>
                            enviarParaFilaDeAnuncios({
                              nome: p.nome,
                              linkAfiliado: p.linkProduto,
                              preco: String(p.precoCentavos),
                              imagemUrl: p.imagemUrl ?? "",
                              textoAnuncio: p.nome,
                            })
                          }
                          className="botao-anuncio"
                        >
                          Enviar pra fila de anúncios
                        </button>
      {aberto && (
        <NovoProdutoModal
          onClose={() => setAberto(false)}
          onSave={p => { saveProduto(p); refresh(); setAberto(false); }}
        />
      )}
    </div>
  );
}

function NovoProdutoModal({ onClose, onSave }: { onClose: () => void; onSave: (p: Produto) => void }) {
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState<Categoria>('Outros');
  const [preco, setPreco] = useState('');
  const [link, setLink] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim() || !link.trim()) return;
    onSave({
      id: uid(),
      nome: nome.trim(),
      categoria,
      precoCentavos: Math.round(parseFloat(preco.replace(',', '.') || '0') * 100),
      linkProduto: link.trim(),
      criadoEm: new Date().toISOString(),
    });
  }

  return (
    <div className="fixed inset-0 z-30 flex items-end bg-black/60" onClick={onClose}>
      <form
        onSubmit={handleSubmit}
        onClick={e => e.stopPropagation()}
        className="w-full rounded-t-2xl bg-surface p-5 pb-8"
      >
        <h2 className="mb-4 font-display text-lg font-600 text-paper">Novo produto</h2>

        <label className="mb-3 block text-xs text-muted">
          Nome do produto
          <input
            value={nome}
            onChange={e => setNome(e.target.value)}
            className="mt-1 w-full rounded-lg bg-surface2 px-3 py-2.5 text-sm text-paper outline-none"
            placeholder="Ex: Bota coturno feminina"
            autoFocus
          />
        </label>

        <label className="mb-3 block text-xs text-muted">
          Categoria
          <select
            value={categoria}
            onChange={e => setCategoria(e.target.value as Categoria)}
            className="mt-1 w-full rounded-lg bg-surface2 px-3 py-2.5 text-sm text-paper outline-none"
          >
            {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>

        <label className="mb-3 block text-xs text-muted">
          Preço (R$)
          <input
            value={preco}
            onChange={e => setPreco(e.target.value)}
            inputMode="decimal"
            className="mt-1 w-full rounded-lg bg-surface2 px-3 py-2.5 text-sm text-paper outline-none"
            placeholder="0,00"
          />
        </label>

        <label className="mb-5 block text-xs text-muted">
          Link do produto na Shopee
          <input
            value={link}
            onChange={e => setLink(e.target.value)}
            className="mt-1 w-full rounded-lg bg-surface2 px-3 py-2.5 text-sm text-paper outline-none"
            placeholder="https://shopee.com.br/..."
          />
        </label>

        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 rounded-lg bg-surface2 py-2.5 text-sm text-muted">
            Cancelar
          </button>
          <button type="submit" className="flex-1 rounded-lg bg-flow py-2.5 text-sm font-medium text-ink">
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
}
