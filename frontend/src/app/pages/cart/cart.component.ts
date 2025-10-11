import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { map } from 'rxjs/operators';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  cart = inject(CartService);

  items$ = this.cart.items$;
  total$ = this.cart.items$.pipe(map(items => items.reduce((sum, i) => sum + i.product.price * i.qty, 0)));

  remove(id: number) { this.cart.remove(id); }
  inc(id: number) { this.cart.updateQty(id, (this.cart.getQty(id) || 0) + 1); }
  dec(id: number) { this.cart.updateQty(id, (this.cart.getQty(id) || 0) - 1); }
}
