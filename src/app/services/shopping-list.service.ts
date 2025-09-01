// src/app/services/shopping-list.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ShoppingItem, ShoppingListStats, SortCriteria, Category } from '../model/shopping-list.model';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  private readonly storageKey = 'shoppingListItems';
  private itemsSubject = new BehaviorSubject<ShoppingItem[]>([]);
  public items$ = this.itemsSubject.asObservable();

  constructor() {
    this.loadFromStorage();
  }

  // Carrega os dados do localStorage
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const items = JSON.parse(stored);
        this.itemsSubject.next(items);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do localStorage:', error);
      this.itemsSubject.next([]);
    }
  }

  // Salva os dados no localStorage
  private saveToStorage(): void {
    try {
      const items = this.itemsSubject.getValue();
      localStorage.setItem(this.storageKey, JSON.stringify(items));
    } catch (error) {
      console.error('Erro ao salvar dados no localStorage:', error);
    }
  }

  // Gera um ID único para cada item
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Adiciona um novo item à lista
  addItem(name: string, category: Category, quantity: number): ShoppingItem {
    // Validações
    if (!name || !category || !quantity) {
      throw new Error('Todos os campos são obrigatórios');
    }

    if (name.length > 50) {
      throw new Error('Nome do produto não pode ter mais de 50 caracteres');
    }

    if (quantity < 1) {
      throw new Error('Quantidade deve ser maior que zero');
    }

    const newItem: ShoppingItem = {
      id: this.generateId(),
      name: name.trim(),
      category,
      quantity: parseInt(quantity.toString()),
      bought: false,
      price: 0,
      createdAt: new Date().toISOString()
    };

    const currentItems = this.itemsSubject.getValue();
    const updatedItems = [...currentItems, newItem];
    this.itemsSubject.next(updatedItems);
    this.saveToStorage();
    
    return newItem;
  }

  // Remove um item da lista
  removeItem(id: string): ShoppingItem | null {
    const currentItems = this.itemsSubject.getValue();
    const index = currentItems.findIndex(item => item.id === id);
    
    if (index !== -1) {
      const removedItem = currentItems[index];
      const updatedItems = currentItems.filter((_, i) => i !== index);
      this.itemsSubject.next(updatedItems);
      this.saveToStorage();
      return removedItem;
    }
    
    return null;
  }

  // Atualiza um item existente
  updateItem(id: string, updates: Partial<ShoppingItem>): ShoppingItem {
    const currentItems = this.itemsSubject.getValue();
    const itemIndex = currentItems.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
      throw new Error('Item não encontrado');
    }

    const item = { ...currentItems[itemIndex] };

    // Validações
    if (updates.name !== undefined) {
      if (!updates.name.trim()) {
        throw new Error('Nome do produto é obrigatório');
      }
      if (updates.name.length > 50) {
        throw new Error('Nome do produto não pode ter mais de 50 caracteres');
      }
      item.name = updates.name.trim();
    }

    if (updates.category !== undefined) {
      if (!updates.category) {
        throw new Error('Categoria é obrigatória');
      }
      item.category = updates.category;
    }

    if (updates.quantity !== undefined) {
      if (updates.quantity < 1) {
        throw new Error('Quantidade deve ser maior que zero');
      }
      item.quantity = parseInt(updates.quantity.toString());
    }

    if (updates.bought !== undefined) {
      item.bought = updates.bought;
    }

    if (updates.price !== undefined) {
      if (updates.price < 0) {
        throw new Error('Preço não pode ser negativo');
      }
      item.price = parseFloat(updates.price.toString()) || 0;
    }

    item.updatedAt = new Date().toISOString();

    const updatedItems = [...currentItems];
    updatedItems[itemIndex] = item;
    this.itemsSubject.next(updatedItems);
    this.saveToStorage();
    
    return item;
  }

  // Marca um item como comprado
  markAsBought(id: string, price: number = 0): ShoppingItem {
    return this.updateItem(id, { bought: true, price: parseFloat(price.toString()) || 0 });
  }

  // Marca um item como não comprado
  markAsNotBought(id: string): ShoppingItem {
    return this.updateItem(id, { bought: false, price: 0 });
  }

  // Obtém todos os itens
  getAllItems(): ShoppingItem[] {
    return [...this.itemsSubject.getValue()];
  }

  // Obtém itens não comprados
  getPendingItems(): ShoppingItem[] {
    return this.itemsSubject.getValue().filter(item => !item.bought);
  }

  // Obtém itens comprados
  getBoughtItems(): ShoppingItem[] {
    return this.itemsSubject.getValue().filter(item => item.bought);
  }

  // Obtém um item específico por ID
  getItemById(id: string): ShoppingItem | undefined {
    return this.itemsSubject.getValue().find(item => item.id === id);
  }

  // Calcula o total dos itens comprados
  getTotalAmount(): number {
    return this.itemsSubject.getValue()
      .filter(item => item.bought)
      .reduce((total, item) => total + (item.price || 0), 0);
  }

  // Ordena os itens por critério especificado
  getSortedItems(sortBy: SortCriteria = 'name'): ShoppingItem[] {
    const items = [...this.itemsSubject.getValue()];
    
    switch (sortBy) {
      case 'name':
        return items.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
      
      case 'category':
        return items.sort((a, b) => {
          if (a.category === b.category) {
            return a.name.localeCompare(b.name, 'pt-BR');
          }
          return a.category.localeCompare(b.category, 'pt-BR');
        });
      
      case 'status':
        return items.sort((a, b) => {
          if (a.bought === b.bought) {
            return a.name.localeCompare(b.name, 'pt-BR');
          }
          return a.bought ? 1 : -1;
        });
      
      default:
        return items;
    }
  }

  // Limpa toda a lista
  clearAll(): void {
    this.itemsSubject.next([]);
    this.saveToStorage();
  }

  // Obtém estatísticas da lista
  getStats(): ShoppingListStats {
    const items = this.itemsSubject.getValue();
    const total = items.length;
    const bought = items.filter(item => item.bought).length;
    const pending = total - bought;
    const totalAmount = this.getTotalAmount();

    return {
      total,
      bought,
      pending,
      totalAmount
    };
  }

  // Busca itens por nome
  searchItems(searchTerm: string): ShoppingItem[] {
    if (!searchTerm.trim()) {
      return this.itemsSubject.getValue();
    }

    const term = searchTerm.toLowerCase().trim();
    return this.itemsSubject.getValue().filter(item => 
      item.name.toLowerCase().includes(term) ||
      item.category.toLowerCase().includes(term)
    );
  }

  // Exporta os dados para backup
  exportData(): string {
    return JSON.stringify({
      items: this.itemsSubject.getValue(),
      exportDate: new Date().toISOString(),
      version: '1.0'
    });
  }

  // Importa dados de backup
  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      if (data.items && Array.isArray(data.items)) {
        this.itemsSubject.next(data.items);
        this.saveToStorage();
        return true;
      }
      throw new Error('Formato de dados inválido');
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      return false;
    }
  }
}