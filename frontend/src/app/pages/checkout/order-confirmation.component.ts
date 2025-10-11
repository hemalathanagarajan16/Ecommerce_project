import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe, TitleCasePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

interface LineItem { product: { name: string; price: number }; qty: number }

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe, TitleCasePipe],
  template: `
<section class="card confirm">
  <h2>Thank you for your order!</h2>
  <div class="order">Order #{{ orderId }}</div>
  <div class="muted">Estimated delivery: {{ eta }}</div>
  <div class="muted" *ngIf="email">Confirmation sent to {{ email }}</div>

  <h3>Order Summary</h3>
  <div class="items">
    <div class="row" *ngFor="let i of items">
      <div>{{ i.product.name }} × {{ i.qty }}</div>
      <div>{{ i.product.price * i.qty | currency }}</div>
    </div>
    <hr />
    <div class="row total"><div>Total</div><div>{{ total | currency }}</div></div>
  </div>

  <div class="actions">
    <button class="btn" (click)="print()">Print invoice</button>
    <a routerLink="/" class="link">Continue shopping</a>
  </div>
</section>
`,
  styles: [
`.confirm { max-width: 720px; margin: 24px auto; padding: 24px; }
.order { font-size: 18px; margin: 6px 0; }
.total { font-weight: 700; margin: 10px 0; }
.btn { padding: 10px 14px; border-radius: 10px; background: #4f7cff; color: white; border: none; margin-right: 8px; }
.link { color: #8ab4ff; }
.card { background: #141821; border: 1px solid #232a3b; border-radius: 16px; }
.items .row { display: flex; justify-content: space-between; margin: 6px 0; }
.items hr { border-color: #232a3b; }
.items .total { font-weight: 700; }
`]
})
export class OrderConfirmationComponent {
  orderId: string = '';
  total: number = 0;
  eta: string = '';
  email: string = '';
  items: LineItem[] = [];

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    const state: any = nav?.extras?.state || {};
    this.total = state.total ?? 0;
    this.eta = state.eta ?? '';
    this.orderId = (this.router?.url?.split('/')?.pop() ?? '');
    this.email = state.email ?? '';
    this.items = state.items ?? [];
  }

  print() { window.print(); }
}
