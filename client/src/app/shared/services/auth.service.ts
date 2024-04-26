import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EUserRoles, IUser } from '../classes/types';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: null | any;
  currentUserRole = this.getUserPayload()?.role;

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

  fetchUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>('/api/user');
  }

  getUserById(id: string): Observable<IUser> {
    return this.http.get<IUser>(`/api/user/${id}`);
  }

  updateUser(user: IUser): Observable<IUser> {
    return this.http.patch<IUser>(`api/user/${user._id}`, user);
  }

  setToken(token: string) {
    this.token = token;
  }

  getToken(): string {
    return this.token;
  }

  refreshToken(): Observable<{ token: string }> {
    return this.http.get<{ token: string }>('/api/user/refresh-token').pipe(
      tap(({ token }) => {
        localStorage.setItem('auth-token', token);
        this.setToken(token);
      })
    );
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  logout() {
    this.setToken(null as unknown as string);
    localStorage.removeItem('auth-token');
  }

  getUserPayload() {
    const token = this.getToken();
    if (token) {
      const userPayload = atob(token.split('.')[1]);
      return JSON.parse(userPayload);
    } else {
      return null;
    }
  }

  isAdmin(): boolean {
    if (this.currentUserRole === EUserRoles.admin) {
      return true;
    } else {
      return false;
    }
  }
}
