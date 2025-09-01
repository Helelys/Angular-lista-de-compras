// src/app/services/modal.service.ts

import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { ShoppingItem, Category } from '../model/shopping-list.model';

export interface EditModalData {
  name: string;
  category: Category;
  quantity: number;
}

export interface PriceModalData {
  price: number;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private editModalSubject = new Subject<{ item: ShoppingItem, result: EditModalData | null }>();
  private priceModalSubject = new Subject<PriceModalData | null>();
  
  public editModal$ = this.editModalSubject.asObservable();
  public priceModal$ = this.priceModalSubject.asObservable();

  // Abre modal de edição
  openEditModal(item: ShoppingItem): Promise<EditModalData | null> {
    return new Promise((resolve) => {
      const subscription = this.editModal$.subscribe((data) => {
        if (data.item.id === item.id) {
          resolve(data.result);
          subscription.unsubscribe();
        }
      });
      
      // Emite o item para ser editado
      this.editModalSubject.next({ item, result: null });
    });
  }

  // Fecha modal de edição com dados
  closeEditModal(item: ShoppingItem, data: EditModalData | null): void {
    this.editModalSubject.next({ item, result: data });
  }

  // Abre modal de preço
  openPriceModal(): Promise<number | null> {
    return new Promise((resolve) => {
      const subscription = this.priceModal$.subscribe((data) => {
        resolve(data ? data.price : null);
        subscription.unsubscribe();
      });
      
      // Emite sinal para abrir modal
      this.priceModalSubject.next(null);
    });
  }

  // Fecha modal de preço com dados
  closePriceModal(price: number | null): void {
    this.priceModalSubject.next(price !== null ? { price } : null);
  }

  // Método para confirmação
  confirm(message: string): boolean {
    return confirm(message);
  }

  // Método para exibir erro
  showError(message: string): void {
    alert(message); // Pode ser substituído por toast/snackbar
  }

  // Método para exibir sucesso
  showSuccess(message: string): void {
    console.log('Sucesso:', message); // Pode ser substituído por toast/snackbar
  }
}