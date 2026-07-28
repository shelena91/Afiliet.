import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getProdutos, getLinks, getComissoes, getPosts, formatBRL } from '../lib/storage';
import PageHeader from '../components/PageHeader';

export default function Painel() {
  const produtos = getProdutos();
  const links = getLinks();
  const comissoes = getComissoes();
  const posts = getPosts();

  const mesAtual = new Date().toISOString().slice(0, 7);
  const comissaoDoMes = useMemo(
    () =>
      comissoes
        .filter(c => c.data.startsWith(mesAtual) && c.status !== 'Cancelada')
        .reduce((sum, c) => sum + c.valorCentavos, 0),
    [comissoes, mesAtual]
  );

  const proximosPosts = posts
    .filter(p => p.data >= new Date().toISOString().slice(0, 10) && p.status === 'Pendente')
    .slice(0, 4);

  return (
    <div>
      <PageHeader title="ShopeeFlow" subtitle="Seu painel de conteúdo de afiliado" />

      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 scrollbar-none">
        <StatCard label="Produtos" value={String(produtos.length)} to="/produtos" />
        <StatCard label="Links" value={String(links.length)} to="/links" />
        <StatCard label="Comissão do mês" value={formatBRL(comissaoDoMes)} to="/comissoes" mono />
        <StatCard label="Posts pendentes" value={String(posts.filter(p => p.status === 'Pendente').length)} to="/calendario" />
      </div>

      <section className="mt-7">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-sm font-600 uppercase tracking-wide text-muted">Próximos posts</h2>
          <Link to="/calendario" className="text-xs text-flow">ver agenda</Link>
        </div>

        {proximosPosts.length === 0 ? (
          <EmptyState
            text="Nenhum post agendado ainda."
            action={{ to: '/calendario', label: 'Agendar conteúdo' }}
          />
        ) : (
          <ul className="space-y-2.5">
            {proximosPosts.map(p => {
              const produto = produtos.find(pr => pr.id === p.produtoId);
              return (
                <li
                  key={p.id}
                  className="flow-thread rounded-xl bg-surface px-4 py-3 pl-5"
                  style={{ '--thread-from': '#F0521E', '--thread-to': '#17B399' } as React.CSSProperties}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-paper">
                      {produto?.nome ?? p.categoria}
                    </span>
                    <span className="font-mono text-xs text-muted">
                      {new Date(p.data + 'T00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted">{p.tipoConteudo} · {p.plataforma}</p>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {produtos.length === 0 && (
        <section className="mt-8">
          <EmptyState
            text="Comece cadastrando seu primeiro produto Shopee."
            action={{ to: '/produtos', label: 'Cadastrar produto' }}
            big
          />
        </section>
      )}
    </div>
  );
}

function StatCard({ label, value, to, mono }: { label: string; value: string; to: string; mono?: boolean }) {
  return (
    <Link
      to={to}
      className="flex min-w-[128px] shrink-0 flex-col justify-between rounded-2xl bg-surface px-4 py-3.5"
    >
      <span className="text-[11px] text-muted">{label}</span>
      <span className={`mt-2 text-xl font-600 text-paper ${mono ? 'font-mono' : 'font-display'}`}>{value}</span>
    </Link>
  );
}

function EmptyState({ text, action, big }: { text: string; action: { to: string; label: string }; big?: boolean }) {
  return (
    <div className={`rounded-2xl border border-dashed border-white/10 bg-surface/40 text-center ${big ? 'py-10' : 'py-6'}`}>
      <p className="px-6 text-sm text-muted">{text}</p>
      <Link to={action.to} className="mt-3 inline-block text-sm font-medium text-flow">
        {action.label} →
      </Link>
    </div>
  );
}
