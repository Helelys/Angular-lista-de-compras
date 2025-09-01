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
    // Inscreve-se nos estados do modal de preço
    this.subscription.add(
      this.modalService.priceModal$.subscribe(state => {
        console.log('ModalPrice recebeu estado:', state); // Debug
        
        if (state.show && !this.showModal) {
          // Abre o modal apenas se não estiver já aberto
          this.openModal();
        } else if (!state.show && this.showModal) {
          // Fecha o modal apenas se estiver aberto
          this.showModal = false;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private openModal(): void {
    console.log('Abrindo modal de preço'); // Debug
    this.price = 0;
    this.showModal = true;
    
    // Foca no input de preço após um pequeno delay
    setTimeout(() => {
      const priceInput = document.getElementById('itemPrice') as HTMLInputElement;
      if (priceInput) {
        priceInput.focus();
      }
    }, 100);
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    console.log('Submetendo preço:', this.price); // Debug
    
    // Valida o preço
    if (this.price < 0) {
      alert('O preço não pode ser negativo');
      return;
    }
    
    this.modalService.closePriceModal(this.price);
  }

  onCancel(): void {
    console.log('Cancelando modal de preço'); // Debug
    this.modalService.closePriceModal(null);
  }

  onClose(): void {
    this.onCancel();
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }
}