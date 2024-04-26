import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../../shared/services/cart.service';
import { ButtonModule, CardModule, GridModule } from '@coreui/angular';
import { IOrder, IProduct, IProductList } from '../../shared/classes/types';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OrderService } from '../../shared/services/order.service';
import { AuthService } from '../../shared/services/auth.service';
import { IconModule } from '@coreui/icons-angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CardModule, GridModule, CommonModule, IconModule, ButtonModule],
  templateUrl: './cart-page.component.html',
})
export class CartPageComponent implements OnInit, OnDestroy {
  currentUserId = this.authService.getUserPayload()?.userId;
  isRegistrationComplete: boolean =
    this.authService.getUserPayload()?.isRegistrationComplete;

  productInCart: IProductList[] = [];
  totalAmmount = '';
  fetchingProducts = false;
  pendingOrder = false;

  cartSubscription!: Subscription;
  orderSubscription!: Subscription;

  constructor(
    private cartService: CartService,
    private router: Router,
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.fetchingProducts = true;
    this.productInCart = this.cartService.getProductList(this.currentUserId);
    this.totalAmmount = this.cartService.totalAmmount;

    if (this.productInCart.length === 0) {
      this.router.navigate(['/product']);
    }

    this.fetchingProducts = false;
  }

  delteProduct(product: IProductList) {
    this.cartService.deleteItemFromCart(product, this.currentUserId);
  }

  plusQty(product: IProductList) {
    if (product.quantity !== undefined) product.quantity++;
    this.cartService.updateQuantity(product, this.currentUserId);
    this.totalAmmount = this.cartService.totalAmmount;
  }

  minusQty(product: IProductList) {
    if (product.quantity !== undefined) product.quantity--;
    this.cartService.updateQuantity(product, this.currentUserId);
    this.totalAmmount = this.cartService.totalAmmount;
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) this.cartSubscription.unsubscribe();
    if (this.orderSubscription) this.orderSubscription.unsubscribe();
  }

  orderProduct() {
    this.pendingOrder = true;

    const order: IOrder = {
      list: this.cartService.productList[this.currentUserId].map((product) => {
        delete product._id;
        delete product.imageSrc;
        return product;
      }),
    };

    this.orderSubscription = this.orderService.createOrder(order).subscribe({
      next: (newOrder) => {
        this.cartService.clearCart(this.currentUserId);
      },
      complete: () => {
        this.router.navigate(['/order']);
        this.pendingOrder = false;
      },
    });
  }
}
