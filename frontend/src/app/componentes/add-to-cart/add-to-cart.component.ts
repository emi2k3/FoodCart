import { NgIf } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'add-to-cart',
  standalone: true,
  imports: [NgIf, FormsModule],
  templateUrl: './add-to-cart.component.html',
})
export class AddToCartComponent {
  @Input() product: any;
  @Input() isOpen: boolean = false;
  @Output() closeModal = new EventEmitter<void>();

  quantity: number = 1;
  note: string = '';

  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart() {
    this.closeModal.emit();
  }

  close() {
    this.closeModal.emit();
    this.quantity = 1;
    this.note = '';
  }
}
