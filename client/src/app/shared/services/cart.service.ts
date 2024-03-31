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

  constructor(private auth: AuthService) {
    this.loadCartData();
  }

  addToCart(product: IProduct, userId: string) {
    const productListInCart: IProductList = Object.assign(
      {},
      {
        _id: product._id,
        //category: product.category,
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
    }
    // Save cart data to sessionStorage after each update
    this.saveCartData();
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

    this.saveCartData();
    this.calculatePrice(userId);
  }

  clearCart(userId: string) {
    this.productList[userId] = [];
    this.price = '';

    this.saveCartData();
  }

  private calculatePrice(userId: string) {
    this.price = this.productList[userId]
      .reduce((acc, product) => (acc += product.cost * product.quantity), 0)
      .toFixed(2);
  }

  private saveCartData() {
    sessionStorage.setItem('cart', JSON.stringify(this.productList));
  }

  private loadCartData() {
    const cartData = sessionStorage.getItem('cart');
    if (cartData) this.productList = JSON.parse(cartData);
  }
}
