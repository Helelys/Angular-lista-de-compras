// src/app/models/shopping-list.models.ts

export interface ShoppingItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  bought: boolean;
  price: number;
  createdAt: string;
  updatedAt?: string;
}

export interface ShoppingListStats {
  total: number;
  bought: number;
  pending: number;
  totalAmount: number;
}

export interface ExportData {
  items: ShoppingItem[];
  exportDate: string;
  version: string;
}

export type SortCriteria = 'name' | 'category' | 'status';

export const CATEGORIES = [
  'Frutas e Verduras',
  'Carnes',
  'Laticínios',
  'Padaria',
  'Limpeza',
  'Higiene',
  'Outros'
] as const;

export type Category = typeof CATEGORIES[number];