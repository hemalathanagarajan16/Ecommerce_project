import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/products.service';
import { Product } from '../../models/product';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { ToastService } from '../../services/toast.service';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-product-list',
  standalone: true,
   imports: [RouterLink],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = [];
  query: string = '';
  sortBy: 'relevance' | 'priceAsc' | 'priceDesc' | 'ratingDesc' = 'relevance';
  priceMin?: number;
  priceMax?: number;
  selectedCategory: string = 'All';

  constructor(public productService: ProductService, private cart: CartService, public wishlist: WishlistService, private toast: ToastService) {}
  products: Product[] = [];
  loading = true;
  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
         this.filteredProducts= data;
        this.allProducts = data;
        this.loading = false;
        
      // extract unique categories **after data is available**
      this.categories = ['All', ...new Set(this.allProducts.map(p => p.category))];

      // apply search and sort
      this.applySearchAndSort();
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.loading = false;
      }
    });
    this.filteredProducts = this.allProducts;

  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.applySearchAndSort();
  }

  addToCart(product: Product): void {
    if (!product.stock || product.stock <= 0) return;
    this.cart.add(product, 1);
    this.toast.show('Added to cart', 'success');
  }

  toggleWishlist(productId: number): void {
    this.wishlist.toggle(productId);
    this.toast.show(this.wishlist.has(productId) ? 'Added to wishlist' : 'Removed from wishlist', 'info');
  }

  onSearch(query: string): void {
    this.query = query.toLowerCase();
    this.applySearchAndSort();
  }

  onSort(change: string): void {
    this.sortBy = change as any;
    this.applySearchAndSort();
  }

  public applySearchAndSort(): void {
    let list = [...(this.allProducts || [])];
    if (this.selectedCategory && this.selectedCategory !== 'All') {
      list = list.filter(p => p.category === this.selectedCategory);
    }
    if (this.query) {
      list = list.filter(p =>
        p.name.toLowerCase().includes(this.query) ||
        p.description.toLowerCase().includes(this.query)
      );
    }
    const hasMin = typeof this.priceMin === 'number' && !Number.isNaN(this.priceMin as number);
    const hasMax = typeof this.priceMax === 'number' && !Number.isNaN(this.priceMax as number);
    if (hasMin) list = list.filter(p => p.price >= (this.priceMin as number));
    if (hasMax) list = list.filter(p => p.price <= (this.priceMax as number));
    switch (this.sortBy) {
      case 'priceAsc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'ratingDesc':
        list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      default:
        break;
    }
    this.filteredProducts = list;
  }
}
