import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth'; // Backend API URL
  private jwtHelper = new JwtHelperService();
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient, private router: Router) {}

  // Login API call
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password });
  }

  // Signup API call
  signup(fullName: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/signup`, { fullName, email, password });
  }

  // Store JWT token
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // Retrieve JWT token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Check if the user is authenticated based on token validity
  isAuthenticated(): boolean {
    const token = this.getToken();
    return token ? !this.jwtHelper.isTokenExpired(token) : false; // Check if token exists before calling isTokenExpired
  }
  

  // Logout and remove the token from localStorage
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }

  // Retrieve user ID from the decoded JWT token
  getUserId(): string {
    const token = this.getToken();
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken?.userId; // User ID from JWT payload
    }
    return '';
  }
}
