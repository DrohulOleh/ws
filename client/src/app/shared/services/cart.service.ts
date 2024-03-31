import { Injectable } from '@angular/core';
import { IProduct, IProductList } from '../classes/types';
import { Subscription } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartSubscription!: Subscription;
  public productList: Record<string, IProductList[]> = {};
  public price = '';

  constructor(private auth: AuthService) {}

  addToCart(product: IProduct, userId: string) {
    const productListInCart: IProductList = Object.assign(
      {},
      {
        _id: product._id,
        category: product.category,
        categoryName: product.categoryName,
        cost: product.cost,
        imageSrc: product.imageSrc,
        name: product.name,
        quantity: product.quantity,
        unit: product.unit,
      }
    );

    if (!this.productList[userId]) {
      this.productList[userId] = [];
    }

    const candidate = this.productList[userId].find(
      (p) => p._id === productListInCart._id
    );

    if (candidate) {
      candidate.quantity += productListInCart.quantity;
    } else {
      this.productList[userId].push(productListInCart);
      //sessionStorage.setItem('cart', JSON.stringify(this.productList));
    }

    this.calculatePrice(userId);
  }

  getProductList(userId: string): IProductList[] {
    return this.productList[userId] || [];
  }

  deleteItemFromCart(productListInCart: IProductList, userId: string) {
    if (!this.productList[userId]) return;

    const idx = this.productList[userId].findIndex(
      (p) => p._id === productListInCart._id
    );

    if (idx !== -1) {
      this.productList[userId].splice(idx, 1);
    }

    this.calculatePrice(userId);
  }

  clearCart(userId: string) {
    this.productList[userId] = [];
    this.price = '';
  }

  private calculatePrice(userId: string) {
    this.price = this.productList[userId]
      .reduce((acc, product) => (acc += product.cost * product.quantity), 0)
      .toFixed(2);
  }
}
