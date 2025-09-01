import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShoppingListService } from '../../services/shopping-list.service';
import { ModalService } from '../../services/modal.service';
import { CATEGORIES, Category } from '../../model/shopping-list.model';

@Component({
  selector: 'app-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './form.html',
  styleUrl: './form.scss'
})
export class Form {
  itemName: string = '';
  itemCategory: Category | '' = '';
  itemQuantity: number = 1;
  categories = CATEGORIES;

  constructor(
    private shoppingService: ShoppingListService,
    private modalService: ModalService
  ) {}

  onSubmit(event: Event): void {
    event.preventDefault();
    
    try {
      // Validação básica no frontend
      if (!this.itemName.trim()) {
        this.modalService.showError('Nome do item é obrigatório');
        return;
      }

      if (!this.itemCategory) {
        this.modalService.showError('Categoria é obrigatória');
        return;
      }

      if (!this.itemQuantity || this.itemQuantity < 1) {
        this.modalService.showError('Quantidade deve ser maior que zero');
        return;
      }

      // Adiciona o item através do serviço
      this.shoppingService.addItem(this.itemName, this.itemCategory, this.itemQuantity);
      
      // Limpa o formulário
      this.clearForm();
      
      this.modalService.showSuccess('Item adicionado com sucesso!');

    } catch (error: any) {
      this.modalService.showError(error.message);
    }
  }

  private clearForm(): void {
    this.itemName = '';
    this.itemCategory = '';
    this.itemQuantity = 1;
  }
}