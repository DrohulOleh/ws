import { Component, OnInit } from '@angular/core';
import { CartService } from '../../shared/services/cart.service';
import { CardModule, GridModule } from '@coreui/angular';
import { IProductList } from '../../shared/classes/types';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CardModule, GridModule, CommonModule],
  templateUrl: './cart-page.component.html',
})
export class CartPageComponent implements OnInit {
  productInCart: IProductList[] = [];
  totalPrice = '';
  fetchingProducts = false;

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.fetchingProducts = true;
    this.productInCart = this.cartService.getProductList();
    this.totalPrice = this.cartService.price;

    if (this.productInCart.length === 0) {
      this.router.navigate(['/product']);
    }
    
    this.fetchingProducts = false;
  }
}
