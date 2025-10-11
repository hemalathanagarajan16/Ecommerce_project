import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { map } from 'rxjs/operators';
import { AuthService } from '../../auth.service';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  public cart = inject(CartService);
  public auth = inject(AuthService);
  private fb = inject(FormBuilder);
  constructor() {
    console.log("auth",this.auth)
  }

  cartCount$ = this.cart.items$.pipe(map(items => items.reduce((sum, i) => sum + i.qty, 0)));
  total$ = this.cart.items$.pipe(map(items => items.reduce((sum, i) => sum + i.product.price * i.qty, 0)));

  showAuthDialog = false;
  authMode: 'login' | 'signup' = 'login';

  authForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  errorMessage = '';

  openAuthDialog(mode: 'login' | 'signup') {
    this.authMode = mode;
    this.showAuthDialog = true;
    this.errorMessage = '';
    this.authForm.reset();
  }

  closeAuthDialog() {
    this.showAuthDialog = false;
  }
ngAfterViewInit() {
  console.log("auth",this.auth)
}
  // submitAuth() {
  //   if (this.authForm.invalid) return;

  //   const { email, password } = this.authForm.value;

  //   if (this.authMode === 'login') {
  //     this.auth.login(email, password);
  //     this.closeAuthDialog();
  //   } else {
  //     this.auth.signup(email, password).subscribe({
  //       next: () => {
  //         this.auth.login(email, password);
  //         this.closeAuthDialog();
  //       },
  //       error: (err) => {
  //         this.errorMessage = err.error?.message || 'Something went wrong';
  //       }
  //     });
  //   }
  // }
submitAuth() {
  if (this.authForm.invalid) return;

  const { email, password } = this.authForm.value;

  if (this.authMode === 'login') {
    // Ensure login returns an Observable, not an OperatorFunction
    this.auth.login(email, password).subscribe({
      next: (res) => {
        console.log("res" , res);
        this.auth.setToken(res);
        this.closeAuthDialog();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Invalid credentials';
      }
    });
  } else {
    this.auth.signup(email, password).subscribe({
      next: () => {
        // Auto-login after signup
        this.auth.login(email, password).subscribe({
          next: (res) => {
            console.log("res" , res);
            this.auth.setToken(res);
            this.closeAuthDialog();
          },
          error: (err) => {
            this.errorMessage = err.error?.message || 'Signup succeeded but login failed';
          }
        });
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Signup failed';
      }
    });
  }
}

  logout() {
    this.auth.logout();
  }
}
