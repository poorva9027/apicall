import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';  // Import AuthService
import { Router } from '@angular/router';  // Import Router for navigation

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule, CommonModule], 
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  isSignUp = true;
  fullName = '';
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  // Toggle between Sign Up and Sign In forms
  toggleAuth() {
    this.isSignUp = !this.isSignUp;
    this.errorMessage = '';  // Reset error message on toggle
  }

  // Handle form submission (Sign Up or Sign In)
  onSubmit() {
    if (this.isSignUp) {
      // Validate that passwords match
      if (this.password !== this.confirmPassword) {
        this.errorMessage = 'Passwords do not match!';
        return;
      }

      // Call AuthService for Sign Up
      this.authService.signup(this.fullName, this.email, this.password).subscribe(
        (response) => {
          this.authService.setToken(response.token);  // Store JWT token
          this.router.navigate(['/dashboard']);  // Redirect to the dashboard or a protected route
        },
        (error) => {
          this.errorMessage = 'Signup failed: ' + error.message;
        }
      );
    } else {
      // Call AuthService for Sign In
      this.authService.login(this.email, this.password).subscribe(
        (response) => {
          this.authService.setToken(response.token);  // Store JWT token
          this.router.navigate(['/dashboard']);  // Redirect to the dashboard or a protected route
        },
        (error) => {
          this.errorMessage = 'Login failed: ' + error.message;
        }
      );
    }
  }
}
