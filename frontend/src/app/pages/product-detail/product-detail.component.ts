import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/products.service';
import { Product } from '../../models/product';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { RecentlyViewedService } from '../../services/recently-viewed.service';
import { Observable } from 'rxjs';

import { CommonModule, AsyncPipe, NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  standalone: true, 
  imports: [
    CommonModule,   
    AsyncPipe,      
    NgIf, NgFor,    
    FormsModule,  
    RouterModule    
  ],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product$!: Observable<Product>;
  products$!: Observable<Product[]>;
  qty = 1;

  constructor(
  private route: ActivatedRoute,
  private productService: ProductService,
  private cart: CartService,
  public wishlist: WishlistService,
  public recently: RecentlyViewedService,
) {
  this.route.params.subscribe(params => {
    const id = Number(params['id']);
    console.log('Product id:', id);

    this.product$ = this.productService.getProductById(id);
    this.product$.subscribe(p => p && this.recently.record(p.id));
    this.products$ = this.productService.getProducts();
  });
}


  ngOnInit(): void {
    console.log("ProductDetailComponent initialized")
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.product$ = this.productService.getProductById(id);
    this.product$.subscribe(p => p && this.recently.record(p.id));
    this.products$ = this.productService.getProducts();
  }

  addToCart(product: Product): void {
    const available = product.stock ?? 0;
    const qty = Math.min(Math.max(1, this.qty), available);
    if (available > 0 && qty > 0) {
      this.cart.add(product, qty);
    }
  }

  getProductById$(id: number): Observable<Product> {
    console.log("ts")
    return this.productService.getProductById(id);
  }
}
