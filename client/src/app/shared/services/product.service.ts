import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICategory } from '../classes/types';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  fetchCategories(): Observable<ICategory[]> {
    return this.http.get<ICategory[]>('/api/category');
  }

  fetchCategoryById(id: string) {}
}
