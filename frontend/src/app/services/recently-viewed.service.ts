import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RecentlyViewedService {
  private readonly storageKey = 'recentlyViewed';
  private idsSubject = new BehaviorSubject<number[]>(this.readFromStorage());
  readonly ids$ = this.idsSubject.asObservable();

  record(productId: number) {
    const existing = this.idsSubject.value.filter(id => id !== productId);
    existing.unshift(productId);
    this.commit(existing.slice(0, 10));
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
  
  getIds(): number[] { return this.idsSubject.value; }

  private commit(list: number[]) {
    this.idsSubject.next(list);
    localStorage.setItem(this.storageKey, JSON.stringify(list));
  }
}

