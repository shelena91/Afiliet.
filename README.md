# ShopeeFlow

App para organizar produtos, links de afiliado, comissões (entrada manual) e
calendário de conteúdo Shopee. Sem API, sem chave, sem backend — tudo guardado
no próprio celular (localStorage).

## Como publicar (sem PC, igual ao Afiliado.AI)

1. Crie um repositório novo no GitHub (pelo app do GitHub ou pelo navegador).
2. Suba todos os arquivos desta pasta para o repositório.
3. No Netlify, "Add new site" → "Import from GitHub" → selecione o repositório.
4. Configuração de build (o Netlify já vai detectar pelo `netlify.toml`):
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Deploy. Depois disso, abra o link no celular e "Adicionar à tela inicial"
   pra instalar como app (PWA).

## Estrutura

- `src/pages/Painel.tsx` — dashboard com resumo
- `src/pages/Produtos.tsx` — cadastro manual de produtos
- `src/pages/Links.tsx` — links de afiliado por plataforma
- `src/pages/Comissoes.tsx` — controle de comissões
- `src/pages/Calendario.tsx` — agenda de conteúdo
- `src/lib/storage.ts` — toda a persistência (localStorage)

## Observação

Os dados ficam salvos só nesse navegador/dispositivo. Se trocar de celular
ou limpar os dados do navegador, as informações se perdem — não há
sincronização em nuvem nesta versão.
