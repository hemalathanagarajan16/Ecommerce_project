import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup,ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-auth-dialog',
  standalone:true,
  imports: [ReactiveFormsModule],
  templateUrl: './auth-dialog.component.html',
  styleUrls: ['./auth-dialog.component.css'],

})
export class AuthDialogComponent {
  @Input() mode: 'login' | 'signup' = 'login';
  @Output() close = new EventEmitter<void>();

  form: FormGroup;
  errorMessage = '';

  constructor(private auth: AuthService, private fb: FormBuilder) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  submit() {
    const { email, password } = this.form.value;
    if (this.mode === 'login') {
      this.auth.login(email, password);
      this.close.emit();
    } else {
      this.auth.signup(email, password).subscribe({
        next: () => {
          this.auth.login(email, password);
          this.close.emit();
        },
        error: (err) => this.errorMessage = err.error.message
      });
    }
  }
}
