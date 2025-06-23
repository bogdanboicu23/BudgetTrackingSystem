import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  registerForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  isLoading = false;

  constructor() {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      
      const { email, password } = this.registerForm.value;
      
      this.authService.register({ email, password }).subscribe({
        next: (response) => {
          console.log('Registration response:', response);
          this.isLoading = false;
          this.snackBar.open('Registration successful! Logging you in...', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          
          // Auto-login after registration
          this.authService.login({ email, password }).subscribe({
            next: (loginResponse) => {
              console.log('Auto-login successful:', loginResponse);
              this.router.navigate(['/dashboard']);
            },
            error: (loginError) => {
              console.error('Auto-login failed:', loginError);
              // If auto-login fails, redirect to login page
              this.router.navigate(['/login']);
            }
          });
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading = false;
          console.error('Registration error:', error);
          const errorMessage = error.status === 400 
            ? 'User already exists' 
            : 'An error occurred. Please try again.';
          
          this.snackBar.open(errorMessage, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  getErrorMessage(field: string): string {
    const control = this.registerForm.get(field);
    
    if (control?.hasError('required')) {
      return `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1').trim()} is required`;
    }
    
    if (control?.hasError('email')) {
      return 'Please enter a valid email';
    }
    
    if (control?.hasError('minlength')) {
      return 'Password must be at least 6 characters';
    }
    
    if (control?.hasError('passwordMismatch')) {
      return 'Passwords do not match';
    }
    
    return '';
  }
}