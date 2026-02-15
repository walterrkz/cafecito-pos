import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { Product } from '../../types/Products';
import { CartItem, SalePayload } from '../../types/Sales';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems$ = new BehaviorSubject<CartItem[]>([]);

  cartChanges$ = this.cartItems$.asObservable();
  cartCount$ = this.cartItems$.pipe(map((items) => items.length));

  get items(): CartItem[] {
    return this.cartItems$.value;
  }

  getItem(productId: string): CartItem | undefined {
    return this.cartItems$.value.find((item) => item.productId === productId);
  }

  setQuantity(product: Product, quantity: number): void {
    const safeQuantity = Math.max(1, Math.min(quantity, product.stock));

    const current = [...this.cartItems$.value];

    const index = current.findIndex((item) => item.productId === product.id);

    if (index !== -1) {
      current[index] = {
        ...current[index],
        quantity: safeQuantity,
      };
    } else {
      current.push({
        productId: product.id,
        productName: product.name,
        unitPrice: product.price,
        quantity: safeQuantity,
      });
    }

    this.cartItems$.next(current);
  }

  removeProduct(productId: string): void {
    this.cartItems$.next(
      this.cartItems$.value.filter((item) => item.productId !== productId),
    );
  }

  clearCart(): void {
    this.cartItems$.next([]);
  }

  getSalePayload(
    customerId?: string,
    paymentMethod: 'cash' | 'card' | 'transfer' = 'cash',
  ): SalePayload {
    return {
      customerId: customerId ?? null,
      paymentMethod,
      items: this.cartItems$.value.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };
  }
}
