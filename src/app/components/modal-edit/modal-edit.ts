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
    // Inscreve-se nos eventos de abertura do modal de edição
    this.subscription.add(
      this.modalService.editModal$.subscribe(data => {
        if (data.result === null && data.item) {
          // Abre o modal
          this.openModal(data.item);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private openModal(item: ShoppingItem): void {
    this.currentItem = item;
    this.editName = item.name;
    this.editCategory = item.category as Category;
    this.editQuantity = item.quantity;
    this.showModal = true;
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    
    if (!this.currentItem) return;

    const updatedData: EditModalData = {
      name: this.editName.trim(),
      category: this.editCategory,
      quantity: this.editQuantity
    };

    this.modalService.closeEditModal(this.currentItem, updatedData);
    this.closeModal();
  }

  onCancel(): void {
    if (!this.currentItem) return;
    
    this.modalService.closeEditModal(this.currentItem, null);
    this.closeModal();
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