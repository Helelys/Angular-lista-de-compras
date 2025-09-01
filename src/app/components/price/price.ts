// src/app/components/price/price.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ShoppingListService } from '../../services/shopping-list.service';

@Component({
  selector: 'app-price',
  imports: [CommonModule],
  templateUrl: './price.html',
  styleUrl: './price.scss'
})
export class Price implements OnInit, OnDestroy {
  totalAmount: number = 0;
  private subscription: Subscription = new Subscription();

  constructor(private shoppingService: ShoppingListService) {}

  ngOnInit(): void {
    // Inscreve-se nas mudanças da lista para atualizar o total
    this.subscription.add(
      this.shoppingService.items$.subscribe(() => {
        this.updateTotal();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private updateTotal(): void {
    this.totalAmount = this.shoppingService.getTotalAmount();
  }

  formatPrice(price: number): string {
    return price.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
}