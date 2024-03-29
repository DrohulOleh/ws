import { Injectable } from '@angular/core';
import { IProduct, IProductList } from '../classes/types';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  public productList: IProductList[] = [];
  public price = '';

  constructor() {}

  addToCart(product: IProduct) {
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

    const candidate = this.productList.find(
      (p) => p._id === productListInCart._id
    );

    if (candidate) {
      candidate.quantity += productListInCart.quantity;
    } else {
      this.productList.push(productListInCart);
    }

    this.calculatePrice();
  }

  getProductList() {
    return this.productList;
  }

  deleteFromCart(productListInCart: IProductList) {
    const idx = this.productList.findIndex(
      (p) => p._id === productListInCart._id
    );

    this.productList.splice(idx, 1);

    this.calculatePrice();
  }

  clearCart() {
    this.productList = [];
    this.price = '';
  }

  private calculatePrice() {
    this.price = this.productList
      .reduce((acc, product) => (acc += product.cost * product.quantity), 0)
      .toFixed(2);
  }
}
