import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: number;
  message: string;
  type?: 'success' | 'error' | 'info';
  timeoutMs?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private seq = 1;
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toastsSubject.asObservable();

  show(message: string, type: Toast['type'] = 'info', timeoutMs: number = 2500) {
    const toast: Toast = { id: this.seq++, message, type, timeoutMs };
    const list = [...this.toastsSubject.value, toast];
    this.toastsSubject.next(list);
    if (timeoutMs > 0) {
      setTimeout(() => this.dismiss(toast.id), timeoutMs);
    }
  }

  dismiss(id: number) {
    this.toastsSubject.next(this.toastsSubject.value.filter(t => t.id !== id));
  }
}


