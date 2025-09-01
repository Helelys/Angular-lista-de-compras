// src/app/components/modal-edit/modal-edit.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ModalService, EditModalData } from '../../services/modal.service';
import { ShoppingItem, CATEGORIES, Category } from '../../model/shopping-list.model';

@Component({
  selector: 'app-modal-edit',
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-edit.html',
  styleUrl: './modal-edit.scss'
})
export class ModalEdit implements OnInit, OnDestroy {
  showModal: boolean = false;
  currentItem: ShoppingItem | null = null;
  
  editName: string = '';
  editCategory: Category = 'Outros';
  editQuantity: number = 1;
  categories = CATEGORIES;
  
  private subscription: Subscription = new Subscription();

  constructor(private modalService: ModalService) {}

  ngOnInit(): void {
    // Inscreve-se nos eventos de abertura/fechamento do modal de edição
    this.subscription.add(
      this.modalService.editModal$.subscribe(state => {
        console.log('ModalEdit recebeu estado:', state); // Debug
        
        if (state.show && state.item && !this.showModal) {
          // Abre o modal com os dados do item
          this.openModal(state.item);
        } else if (!state.show && this.showModal) {
          // Fecha o modal
          this.closeModal();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private openModal(item: ShoppingItem): void {
    console.log('Abrindo modal de edição para:', item); // Debug
    this.currentItem = item;
    this.editName = item.name;
    this.editCategory = item.category as Category;
    this.editQuantity = item.quantity;
    this.showModal = true;

    // Foca no primeiro input após um pequeno delay
    setTimeout(() => {
      const nameInput = document.getElementById('editItemName') as HTMLInputElement;
      if (nameInput) {
        nameInput.focus();
      }
    }, 100);
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    
    if (!this.currentItem) return;

    // Validações
    if (!this.editName.trim()) {
      alert('Nome do item é obrigatório');
      return;
    }

    if (!this.editCategory) {
      alert('Categoria é obrigatória');
      return;
    }

    if (this.editQuantity < 1) {
      alert('Quantidade deve ser maior que zero');
      return;
    }

    const updatedData: EditModalData = {
      name: this.editName.trim(),
      category: this.editCategory,
      quantity: this.editQuantity
    };

    console.log('Submetendo edição:', updatedData); // Debug
    this.modalService.closeEditModal(updatedData);
  }

  onCancel(): void {
    console.log('Cancelando modal de edição'); // Debug
    this.modalService.closeEditModal(null);
  }

  onClose(): void {
    this.onCancel();
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }

  private closeModal(): void {
    this.showModal = false;
    this.currentItem = null;
    this.editName = '';
    this.editCategory = 'Outros';
    this.editQuantity = 1;
  }
}