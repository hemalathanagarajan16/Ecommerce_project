import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject,catchError, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:5000/api';
  public currentUser = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    if (token) this.currentUser.next({ token });
    console.log("currentUser",this.currentUser)
  }

    /** 🔹 Signup */
  signup(email: string, password: string) {
    return this.http
      .post(`${this.baseUrl}/signup`, { email, password })
      .pipe(
        catchError(err => {
          console.error('Signup error:', err);
          return throwError(() => err);
        })
      );
  }

  /** 🔹 Login */
  login(email: string, password: string) {
    // ⬇️ Return the Observable instead of subscribing inside
    return this.http
      .post<{ token: string }>(`${this.baseUrl}/login`, { email, password })
      .pipe(
        catchError(err => {
          console.error('Login error:', err);
          return throwError(() => err);
        })
      );
  }
 setToken(response) {
    localStorage.setItem('token', response.token);
    localStorage.setItem('email', response.email);
    this.currentUser.next(response);
  }
  logout() {
    localStorage.removeItem('token');
    this.currentUser.next(null);
  }

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }
}
