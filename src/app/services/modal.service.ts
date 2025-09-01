// src/app/services/modal.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ShoppingItem, Category } from '../model/shopping-list.model';

export interface EditModalData {
  name: string;
  category: Category;
  quantity: number;
}

export interface EditModalState {
  show: boolean;
  item: ShoppingItem | null;
  result?: EditModalData | null;
}

export interface PriceModalState {
  show: boolean;
  result?: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  // Para modal de edição
  private editModalSubject = new BehaviorSubject<EditModalState>({ 
    show: false, 
    item: null 
  });
  public editModal$ = this.editModalSubject.asObservable();
  
  // Para modal de preço
  private priceModalSubject = new BehaviorSubject<PriceModalState>({ 
    show: false 
  });
  public priceModal$ = this.priceModalSubject.asObservable();

  // Promises para controlar o fluxo async
  private currentEditResolve: ((value: EditModalData | null) => void) | null = null;
  private currentPriceResolve: ((value: number | null) => void) | null = null;

  // === MODAL DE EDIÇÃO ===
  openEditModal(item: ShoppingItem): Promise<EditModalData | null> {
    return new Promise((resolve) => {
      this.currentEditResolve = resolve;
      
      // Emite estado para abrir o modal
      this.editModalSubject.next({
        show: true,
        item: item
      });
    });
  }

  closeEditModal(data: EditModalData | null): void {
    // Fecha o modal
    this.editModalSubject.next({
      show: false,
      item: null,
      result: data
    });
    
    // Resolve a Promise se existir
    if (this.currentEditResolve) {
      this.currentEditResolve(data);
      this.currentEditResolve = null;
    }
  }

  // === MODAL DE PREÇO ===
  openPriceModal(): Promise<number | null> {
    return new Promise((resolve) => {
      this.currentPriceResolve = resolve;
      
      // Emite estado para abrir o modal
      this.priceModalSubject.next({
        show: true
      });
    });
  }

  closePriceModal(price: number | null): void {
    // Fecha o modal
    this.priceModalSubject.next({
      show: false,
      result: price
    });
    
    // Resolve a Promise se existir
    if (this.currentPriceResolve) {
      this.currentPriceResolve(price);
      this.currentPriceResolve = null;
    }
  }

  // === MÉTODOS UTILITÁRIOS ===
  confirm(message: string): boolean {
    return confirm(message);
  }

  showError(message: string): void {
    alert('Erro: ' + message);
  }

  showSuccess(message: string): void {
    console.log('Sucesso:', message);
    // Você pode substituir por um toast/snackbar mais elegante
  }
}