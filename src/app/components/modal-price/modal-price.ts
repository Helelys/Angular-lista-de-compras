// src/app/components/modal-price/modal-price.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-modal-price',
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-price.html',
  styleUrl: './modal-price.scss'
})
export class ModalPrice implements OnInit, OnDestroy {
  showModal: boolean = false;
  price: number = 0;
  
  private subscription: Subscription = new Subscription();

  constructor(private modalService: ModalService) {}

  ngOnInit(): void {
    // Inscreve-se nos eventos de abertura do modal de preço
    this.subscription.add(
      this.modalService.priceModal$.subscribe(data => {
        if (data === null) {
          // Abre o modal
          this.openModal();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private openModal(): void {
    this.price = 0;
    this.showModal = true;
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    
    this.modalService.closePriceModal(this.price);
    this.closeModal();
  }

  onCancel(): void {
    this.modalService.closePriceModal(null);
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
    this.price = 0;
  }
}