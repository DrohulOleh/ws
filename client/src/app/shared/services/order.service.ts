import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IOrder } from '../classes/types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient) {}

  fetchOrders(params: any = {}): Observable<IOrder[]> {
    return this.http.get<IOrder[]>('/api/order');
  }

  createOrder(order: IOrder): Observable<IOrder> {
    return this.http.post<IOrder>('/api/order', order);
  }
}
