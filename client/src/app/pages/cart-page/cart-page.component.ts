import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../../shared/services/cart.service';
import { CardModule, GridModule } from '@coreui/angular';
import { IProductList } from '../../shared/classes/types';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OrderService } from '../../shared/services/order.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CardModule, GridModule, CommonModule],
  templateUrl: './cart-page.component.html',
})
export class CartPageComponent implements OnInit, OnDestroy {
  productInCart: IProductList[] = [];
  totalPrice = '';
  fetchingProducts = false;


  constructor(
    private cartService: CartService,
    private router: Router,
    private orderService: OrderService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.fetchingProducts = true;
    this.productInCart = this.cartService.getProductList();
    this.totalPrice = this.cartService.price;

    if (this.productInCart.length === 0) {
      this.router.navigate(['/product']);
    }

    this.fetchingProducts = false;

    const token=this.auth.getToken();
    console.log(token);
  }

  ngOnDestroy(): void {
    this.productInCart = [];
  }
}
