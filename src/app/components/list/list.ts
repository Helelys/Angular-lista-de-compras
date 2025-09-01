// src/app/components/list/list.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ShoppingListService } from '../../services/shopping-list.service';
import { ModalService } from '../../services/modal.service';
import { ShoppingItem, SortCriteria } from '../../model/shopping-list.model';

@Component({
  selector: 'app-list',
  imports: [CommonModule],
  templateUrl: './list.html',
  styleUrl: './list.scss'
})
export class List implements OnInit, OnDestroy {
  pendingItems: ShoppingItem[] = [];
  boughtItems: ShoppingItem[] = [];
  private subscription: Subscription = new Subscription();

  constructor(
    private shoppingService: ShoppingListService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    // Inscreve-se nas mudanças da lista
    this.subscription.add(
      this.shoppingService.items$.subscribe(items => {
        this.updateLists(items);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  trackByFn(index: number, item: ShoppingItem): string {
    return item.id;
  }

  private updateLists(items: ShoppingItem[]): void {
    // Ordena os itens (pode receber o critério de ordenação do Header via Input se necessário)
    const sortedItems = this.sortItems(items, 'name');
    
    this.pendingItems = sortedItems.filter(item => !item.bought);
    this.boughtItems = sortedItems.filter(item => item.bought);
  }

  private sortItems(items: ShoppingItem[], sortBy: SortCriteria): ShoppingItem[] {
    return this.shoppingService.getSortedItems(sortBy);
  }

  async onBuyItem(item: ShoppingItem): Promise<void> {
    try {
      const price = await this.modalService.openPriceModal();
      
      if (price !== null) {
        this.shoppingService.markAsBought(item.id, price);
        this.modalService.showSuccess('Item marcado como comprado!');
      }
    } catch (error: any) {
      this.modalService.showError(error.message);
    }
  }

  async onUnbuyItem(item: ShoppingItem): Promise<void> {
    try {
      if (this.modalService.confirm('Deseja desmarcar este item como comprado?')) {
        this.shoppingService.markAsNotBought(item.id);
        this.modalService.showSuccess('Item desmarcado como comprado!');
      }
    } catch (error: any) {
      this.modalService.showError(error.message);
    }
  }

  async onEditItem(item: ShoppingItem): Promise<void> {
    try {
      const updatedData = await this.modalService.openEditModal(item);
      
      if (updatedData) {
        this.shoppingService.updateItem(item.id, updatedData);
        this.modalService.showSuccess('Item atualizado com sucesso!');
      }
    } catch (error: any) {
      this.modalService.showError(error.message);
    }
  }

  onDeleteItem(item: ShoppingItem): void {
    try {
      const confirmMessage = `Tem certeza que deseja excluir "${item.name}"?`;
      
      if (this.modalService.confirm(confirmMessage)) {
        this.shoppingService.removeItem(item.id);
        this.modalService.showSuccess('Item excluído com sucesso!');
      }
    } catch (error: any) {
      this.modalService.showError(error.message);
    }
  }

  formatPrice(price: number): string {
    return price.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
}