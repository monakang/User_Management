import { Component, DestroyRef, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatToolbar } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { AuthenticationService } from '../auth/authentication.service';

import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-login',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatToolbar,
    MatCardModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private router = inject(Router);
  private authService = inject(AuthenticationService);
  loginForm!: FormGroup;
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
    });
    this.authService.logout(); // Clear any existing session on component init
  }
  onFormSubmit() {
    if (this.loginForm.valid) {
      this.authService.loginUser(this.loginForm.value).subscribe({
        next: (val: any) => {
          localStorage.setItem('token', val.token); // Store token in localStorage
          localStorage.setItem('refreshToken', val.refreshToken); // Save refresh token

          this.router.navigate(['/user']);
        },
        error: (err) => console.error('Login failed', err),
      });
    }
  }
}
