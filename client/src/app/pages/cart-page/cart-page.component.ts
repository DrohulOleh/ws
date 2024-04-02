import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../../shared/services/cart.service';
import { CardModule, GridModule } from '@coreui/angular';
import { IProduct, IProductList } from '../../shared/classes/types';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OrderService } from '../../shared/services/order.service';
import { AuthService } from '../../shared/services/auth.service';
import { IconModule } from '@coreui/icons-angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CardModule, GridModule, CommonModule, IconModule],
  templateUrl: './cart-page.component.html',
})
export class CartPageComponent implements OnInit, OnDestroy {
  currentUserId = this.auth.getUserPayload()?.userId;
  productInCart: IProductList[] = [];
  totalAmmount = '';
  fetchingProducts = false;
  cartSubscription!: Subscription;

  constructor(
    private cartService: CartService,
    private router: Router,
    private orderService: OrderService,
    private auth: AuthService
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
  }

  minusQty(product: IProductList) {
    if (product.quantity !== undefined) product.quantity--;
    this.cartService.updateQuantity(product, this.currentUserId);
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) this.cartSubscription.unsubscribe();
  }
}
