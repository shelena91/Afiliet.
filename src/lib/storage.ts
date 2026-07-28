import type { Produto, LinkAfiliado, Comissao, PostCalendario } from '../types';

const KEYS = {
  produtos: 'shopeeflow:produtos',
  links: 'shopeeflow:links',
  comissoes: 'shopeeflow:comissoes',
  calendario: 'shopeeflow:calendario',
} as const;

function read<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, items: T[]) {
  localStorage.setItem(key, JSON.stringify(items));
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

// Produtos
export const getProdutos = () => read<Produto>(KEYS.produtos).sort((a, b) => b.criadoEm.localeCompare(a.criadoEm));
export const saveProduto = (p: Produto) => write(KEYS.produtos, [...getProdutos(), p]);
export const deleteProduto = (id: string) => write(KEYS.produtos, getProdutos().filter(p => p.id !== id));

// Links
export const getLinks = () => read<LinkAfiliado>(KEYS.links).sort((a, b) => b.criadoEm.localeCompare(a.criadoEm));
export const saveLink = (l: LinkAfiliado) => write(KEYS.links, [...getLinks(), l]);
export const deleteLink = (id: string) => write(KEYS.links, getLinks().filter(l => l.id !== id));

// Comissões
export const getComissoes = () => read<Comissao>(KEYS.comissoes).sort((a, b) => b.data.localeCompare(a.data));
export const saveComissao = (c: Comissao) => write(KEYS.comissoes, [...getComissoes(), c]);
export const updateComissao = (c: Comissao) => write(KEYS.comissoes, getComissoes().map(x => x.id === c.id ? c : x));
export const deleteComissao = (id: string) => write(KEYS.comissoes, getComissoes().filter(c => c.id !== id));

// Calendário
export const getPosts = () => read<PostCalendario>(KEYS.calendario).sort((a, b) => a.data.localeCompare(b.data));
export const savePost = (p: PostCalendario) => write(KEYS.calendario, [...getPosts(), p]);
export const updatePost = (p: PostCalendario) => write(KEYS.calendario, getPosts().map(x => x.id === p.id ? p : x));
export const deletePost = (id: string) => write(KEYS.calendario, getPosts().filter(p => p.id !== id));

export function formatBRL(centavos: number): string {
  return (centavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
          }
