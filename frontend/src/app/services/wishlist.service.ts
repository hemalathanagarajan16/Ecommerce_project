import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private readonly storageKey = 'wishlist';
  private idsSubject = new BehaviorSubject<number[]>(this.readFromStorage());
  readonly ids$ = this.idsSubject.asObservable();

  toggle(productId: number) {
    const set = new Set(this.idsSubject.value);
    if (set.has(productId)) set.delete(productId); else set.add(productId);
    this.commit(Array.from(set));
  }

  has(productId: number): boolean {
    return this.idsSubject.value.includes(productId);
  }

  private readFromStorage(): number[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed as number[];
    } catch {
      return [];
    }
  }

  private commit(list: number[]) {
    this.idsSubject.next(list);
    localStorage.setItem(this.storageKey, JSON.stringify(list));
  }
}

