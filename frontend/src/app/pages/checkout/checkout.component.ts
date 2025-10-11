import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  public cart = inject(CartService);
  private toast = inject(ToastService);
  private router = inject(Router);

  private readonly addressStorageKey = 'checkout_address_v1';
  step: 1 | 2 | 3 = 1;

  form = {
    name: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'India',
    card: '',
    cardExpiry: '',
    cardCvv: ''
  };
  saveAddress: boolean = true;

  countries = ['United States', 'India', 'Other'];
  usStates = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];
  indiaStates = ['AP','AR','AS','BR','CT','GA','GJ','HR','HP','JH','KA','KL','MP','MH','MN','ML','MZ','NL','OD','PB','RJ','SK','TN','TS','TR','UP','UK','WB','DL','JK','LA','LD','PY','AN','CH','DN','DD','DH'];

  couponCode: string = '';
  appliedCoupon?: { code: string; description: string; percent?: number; amountOff?: number; freeShipping?: boolean };

  shippingMethod: 'standard' | 'express' | 'overnight' = 'standard';
  paymentMethod: 'card' | 'cod' | 'paypal' = 'card';
  agreeToTerms: boolean = false;

  get shipping(): number {
    if (this.cart.total > 500 || this.appliedCoupon?.freeShipping) return 0;
    switch (this.shippingMethod) {
      case 'express': return 25;
      case 'overnight': return 40;
      default: return 15;
    }
  }

  get discount(): number {
    if (!this.appliedCoupon) return 0;
    const subtotal = this.cart.total;
    let d = 0;
    if (this.appliedCoupon.percent) {
      d += subtotal * (this.appliedCoupon.percent / 100);
    }
    if (this.appliedCoupon.amountOff) {
      d += this.appliedCoupon.amountOff;
    }
    return Math.min(d, subtotal);
  }

  get taxedSubtotal(): number {
    const subtotalAfterDiscount = Math.max(0, this.cart.total - this.discount);
    return subtotalAfterDiscount;
  }

  get tax(): number { return this.taxedSubtotal * 0.08; }

  get orderTotal(): number { return this.taxedSubtotal + this.tax + this.shipping; }

  get estimatedDelivery(): string {
    const now = new Date();
    const addDays = (d: number) => {
      const copy = new Date(now);
      copy.setDate(copy.getDate() + d);
      return copy.toLocaleDateString();
    };
    switch (this.shippingMethod) {
      case 'express': return `${addDays(2)} - ${addDays(3)}`;
      case 'overnight': return addDays(1);
      default: return `${addDays(5)} - ${addDays(7)}`;
    }
  }

  get hasItems(): boolean { return (this.cart as any).itemsSubject?.value?.length > 0; }

  ngOnInit() {
    this.loadSavedAddress();
  }

  private isEmailValid(email: string): boolean {
    return /.+@.+\..+/.test(email);
  }

  private isCardValid(): boolean {
    if (this.paymentMethod !== 'card') return true;
    const digits = (this.form.card || '').replace(/\D/g, '');
    const expiryOk = /^(0[1-9]|1[0-2])\/(\d{2})$/.test(this.form.cardExpiry || '');
    const cvvOk = /^\d{3,4}$/.test(this.form.cardCvv || '');
    return digits.length >= 12 && expiryOk && cvvOk;
  }

  private isAddressValid(): boolean {
    if (!(this.form.name && this.isEmailValid(this.form.email) && this.form.street && this.form.city && this.form.country)) return false;
    if (this.form.country === 'United States' && !/^[0-9]{5}(-[0-9]{4})?$/.test(this.form.zip)) return false;
    if (this.form.country === 'India' && !/^[1-9][0-9]{5}$/.test(this.form.zip)) return false;
    if (!this.form.zip) return false;
    if (this.form.country !== 'Other' && !this.form.state) return false;
    return true;
  }

  private saveAddressToStorage() {
    if (!this.saveAddress) return;
    const data = {
      name: this.form.name,
      email: this.form.email,
      street: this.form.street,
      city: this.form.city,
      state: this.form.state,
      zip: this.form.zip,
      country: this.form.country
    };
    try { localStorage.setItem(this.addressStorageKey, JSON.stringify(data)); } catch {}
  }

  loadSavedAddress() {
    try {
      const raw = localStorage.getItem(this.addressStorageKey);
      if (!raw) return;
      const data = JSON.parse(raw);
      Object.assign(this.form, data);
    } catch {}
  }

  next() {
    if (this.step === 1) {
      if (!this.isAddressValid()) { this.toast.show('Please complete a valid shipping address.', 'error'); return; }
      this.saveAddressToStorage();
      this.step = 2;
      return;
    }
    if (this.step === 2) {
      if (!this.isCardValid()) { this.toast.show('Please provide valid payment details.', 'error'); return; }
      this.step = 3;
    }
  }

  back() { if (this.step > 1) this.step = (this.step - 1) as 1 | 2 | 3; }

  applyCoupon() {
    const code = (this.couponCode || '').trim().toUpperCase();
    switch (code) {
      case 'SAVE10':
        this.appliedCoupon = { code, description: 'Save 10% on subtotal', percent: 10 };
        break;
      case 'FREESHIP':
        this.appliedCoupon = { code, description: 'Free standard shipping', freeShipping: true };
        break;
      case 'SAVE50':
        this.appliedCoupon = { code, description: '$50 off orders', amountOff: 50 };
        break;
      default:
        this.appliedCoupon = undefined;
        this.toast.show('Invalid coupon code', 'error');
        return;
    }
    this.toast.show('Coupon applied: ' + this.appliedCoupon.description, 'success');
  }

  placeOrder() {
    if (!this.isAddressValid()) {
      this.toast.show('Please complete name, email and full address.', 'error');
      this.step = 1; return;
    }
    if (!this.agreeToTerms) {
      this.toast.show('Please agree to the terms and conditions.', 'error');
      return;
    }
    if (!this.isCardValid()) {
      this.toast.show('Please enter a valid card number, expiry and CVV.', 'error');
      return;
    }
    const totalStr = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(this.orderTotal);
    this.toast.show(`Order placed! Total ${totalStr}. Check your email for confirmation.`, 'success', 4000);
    this.cart.clear();
    const orderId = Math.floor(Math.random() * 900000 + 100000).toString();
    const orderTotal = this.orderTotal;
    const eta = this.estimatedDelivery;
    const items = (this.cart as any).itemsSubject?.value ?? [];
    const maskedEmail = (this.form.email || '').replace(/(^.).*(@.*$)/, (_, a, b) => a + '***' + b);
    // Navigate to confirmation with summary data
    this.router.navigate(['order-confirmation', orderId], { state: { total: orderTotal, eta, name: this.form.name, email: maskedEmail, items } });
    this.form = { name: '', email: '', street: '', city: '', state: '', zip: '', country: 'United States', card: '', cardExpiry: '', cardCvv: '' };
    this.couponCode = '';
    this.appliedCoupon = undefined;
    this.shippingMethod = 'standard';
    this.paymentMethod = 'card';
    this.agreeToTerms = false;
    this.step = 1;
  }

  increment(productId: number) {
    const current = this.cart.getQty(productId);
    this.cart.updateQty(productId, current + 1);
  }

  decrement(productId: number) {
    const current = this.cart.getQty(productId);
    if (current <= 1) { this.cart.remove(productId); return; }
    this.cart.updateQty(productId, current - 1);
  }

  remove(productId: number) { this.cart.remove(productId); }
}
