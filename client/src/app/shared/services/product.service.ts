import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICategory, IMessage, IProduct } from '../classes/types';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  fetchCategories(): Observable<ICategory[]> {
    return this.http.get<ICategory[]>('/api/category');
  }

  fetchCategoryById(id: string): Observable<ICategory> {
    return this.http.get<ICategory>(`/api/category/${id}`);
  }

  createCategory(name: string, image?: File): Observable<ICategory> {
    const fd = new FormData();

    if (image) {
      fd.append('image', image, image.name);
    }
    fd.append('name', name);

    return this.http.post<ICategory>('/api/category', fd);
  }

  updateCategory(
    id: string,
    name: string,
    image?: File
  ): Observable<ICategory> {
    const fd = new FormData();

    if (image) {
      fd.append('image', image, image.name);
    }
    fd.append('name', name);

    return this.http.patch<ICategory>(`/api/category/${id}`, fd);
  }

  deleteCategory(id: string): Observable<IMessage> {
    return this.http.delete<IMessage>(`/api/category/${id}`);
  }

  fetchProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>('/api/product');
  }

  fetchProductsByCategoryId(categoryId: string): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(`/api/product/${categoryId}`);
  }

  createProduct(product: IProduct): Observable<IProduct> {
    return this.http.post<IProduct>('/api/product', product);
  }

  updateProduct(product: IProduct): Observable<IProduct> {
    return this.http.patch<IProduct>(`/api/product/${product._id}`, product);
  }

  deleteProduct(product: IProduct): Observable<IMessage> {
    return this.http.delete<IMessage>(`/api/product/${product._id}`);
  }
}
