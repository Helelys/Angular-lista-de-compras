// src/app/components/header/header.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShoppingListService } from '../../services/shopping-list.service';
import { ModalService } from '../../services/modal.service';
import { SortCriteria } from '../../model/shopping-list.model';

@Component({
  selector: 'app-header',
  imports: [CommonModule, FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  currentSort: SortCriteria = 'name';

  constructor(
    private shoppingService: ShoppingListService,
    private modalService: ModalService
  ) {}

  onSortChange(sortBy: SortCriteria): void {
    this.currentSort = sortBy;
    // O componente List irá reagir automaticamente através do Observable
  }

  onClearAll(): void {
    const stats = this.shoppingService.getStats();
    
    if (stats.total === 0) {
      this.modalService.showError('A lista já está vazia');
      return;
    }

    const confirmMessage = `Tem certeza que deseja limpar toda a lista? Isso irá remover ${stats.total} item(s).`;
    
    if (this.modalService.confirm(confirmMessage)) {
      this.shoppingService.clearAll();
      this.modalService.showSuccess('Lista limpa com sucesso!');
    }
  }
}