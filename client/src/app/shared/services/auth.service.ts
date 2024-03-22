import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser } from '../classes/types';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: null | any;

  constructor(private http: HttpClient) {}

  registration(user: IUser): Observable<IUser> {
    return this.http.post<IUser>('/api/user/registration', user);
  }

  login(user: IUser): Observable<{ token: string }> {
    return this.http.post<{ token: string }>('/api/user/login', user).pipe(
      tap(({ token }) => {
        localStorage.setItem('auth-token', token);
        this.setToken(token);
      })
    );
  }

  setToken(token: string) {
    this.token = token;
  }

  getToken(): string {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  logout() {
    this.setToken(null as unknown as string);
    localStorage.removeItem('auth-token');
  }
}
