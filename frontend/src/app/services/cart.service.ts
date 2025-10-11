import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product';

export interface CartItem {
  product: Product;
  qty: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly storageKey = 'cart';
  private readonly itemsSubject = new BehaviorSubject<CartItem[]>(this.readFromStorage());
  readonly items$ = this.itemsSubject.asObservable();

  private readFromStorage(): CartItem[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed as CartItem[];
    } catch {
      return [];
    }
  }

  add(product: Product, qty: number = 1) {
    const list = [...this.itemsSubject.value];
    const existing = list.find(i => i.product.id === product.id);
    const stock = product.stock ?? Number.POSITIVE_INFINITY;
    if (existing) {
      existing.qty = Math.min(existing.qty + qty, stock);
    } else {
      list.push({ product, qty: Math.min(qty, stock) });
    }
    this.commit(list);
  }

  remove(productId: number) {
    const next = this.itemsSubject.value.filter(i => i.product.id !== productId);
    this.commit(next);
  }

  clear() {
    this.commit([]);
  }

  updateQty(productId: number, qty: number) {
    const list = [...this.itemsSubject.value];
    const it = list.find(i => i.product.id === productId);
    if (!it) return;
    const stock = it.product.stock ?? Number.POSITIVE_INFINITY;
    it.qty = Math.max(1, Math.min(qty, stock));
    this.commit(list);
  }

  get total(): number {
    return this.itemsSubject.value.reduce((sum, i) => sum + i.product.price * i.qty, 0);
  }

  getQty(productId: number): number {
    return this.itemsSubject.value.find(i => i.product.id === productId)?.qty ?? 0;
  }

  private commit(list: CartItem[]) {
    this.itemsSubject.next(list);
    localStorage.setItem(this.storageKey, JSON.stringify(list));
  }
}
