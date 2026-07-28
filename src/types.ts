export type Categoria =
  | 'Moda Feminina'
  | 'Botas'
  | 'Calçados'
  | 'Bolsas'
  | 'Utensílios de Casa'
  | 'Outros';

export const CATEGORIAS: Categoria[] = [
  'Moda Feminina',
  'Botas',
  'Calçados',
  'Bolsas',
  'Utensílios de Casa',
  'Outros',
];

export interface Produto {
  id: string;
  nome: string;
  categoria: Categoria;
  precoCentavos: number;
  linkProduto: string;
  imagemUrl?: string;
  criadoEm: string; // ISO
}

export interface LinkAfiliado {
  id: string;
  produtoId: string;
  url: string;
  plataforma: string;
  criadoEm: string;
}

export type StatusComissao = 'Pendente' | 'Confirmada' | 'Cancelada';

export interface Comissao {
  id: string;
  produtoId?: string;
  descricao: string;
  valorCentavos: number;
  status: StatusComissao;
  data: string; // ISO date
}

export type StatusPost = 'Pendente' | 'Publicado';

export const PLATAFORMAS = ['Instagram', 'TikTok', 'YouTube', 'WhatsApp', 'Pinterest', 'Blog'] as const;
export const TIPOS_CONTEUDO = ['Reels', 'Stories', 'Feed', 'Carrossel', 'Vídeo', 'Live'] as const;

export interface PostCalendario {
  id: string;
  data: string; // ISO date
  produtoId?: string;
  categoria: Categoria;
  tipoConteudo: string;
  plataforma: string;
  status: StatusPost;
  notas?: string;
}
