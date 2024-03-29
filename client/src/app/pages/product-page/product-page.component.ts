import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Observable, switchMap, map } from 'rxjs';
import { ICategory, IProduct } from '../../shared/classes/types';
import { ProductService } from '../../shared/services/product.service';
import {
  ButtonModule,
  CardModule,
  CollapseModule,
  FormModule,
  GridModule,
  SpinnerModule,
} from '@coreui/angular';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconModule } from '@coreui/icons-angular';
import { CartService } from '../../shared/services/cart.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    //CollapseModule,
    CommonModule,
    FormModule,
    FormsModule,
    GridModule,
    IconModule,
    ReactiveFormsModule,
    RouterLink,
    SpinnerModule,
  ],
  templateUrl: './product-page.component.html',
})
export class ProductPageComponent implements OnInit {
  //@ViewChild('ellipsisText') ellipsisText!: ElementRef;
  categories$!: Observable<ICategory[]>;
  productsAll: IProduct[] = [];
  productsInCategories: IProduct[] = [];
  selectedCategoryId = '';
  selectedCategoryName = '';

  fetchingProducts = false;

  showCategoriesTEMPLATE = true;
  showProductsInCategoriesSwitcherTEMPLATE = true;
  showProductsAllTEMPLATE = false;
  showProductsByCategoryTEMPLATE = false;

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.categories$ = this.productService.fetchCategories();
  }

  showProductsByCategory(categoryId: string, categoryName: string) {
    this.showCategoriesTEMPLATE = false;
    this.showProductsInCategoriesSwitcherTEMPLATE = false;
    this.showProductsByCategoryTEMPLATE = true;

    this.fetchingProducts = true;
    this.selectedCategoryId = categoryId;
    this.selectedCategoryName = categoryName;

    this.productService.fetchProductsByCategoryId(categoryId).subscribe({
      next: (productsInCategories) => {
        this.productsInCategories = productsInCategories.map((product) => {
          product.categoryName = this.selectedCategoryName;
          product.quantity = 1;
          return product;
        });
        this.fetchingProducts = false;
      },
    });
  }

  showProductsAll() {
    this.showCategoriesTEMPLATE = !this.showCategoriesTEMPLATE;
    this.showProductsAllTEMPLATE = !this.showProductsAllTEMPLATE;

    this.fetchingProducts = true;

    this.productService
      .fetchProducts()
      .pipe(
        switchMap((productsAll) => {
          return this.categories$.pipe(
            map((categories) => {
              return productsAll
                .map((product) => {
                  product.quantity = 1;
                  const category = categories.find(
                    (c) => c._id === product.category
                  );
                  product.categoryName = category ? category.name : '';
                  return product;
                })
                .sort((a, b) => (a.name > b.name ? 1 : -1));
            })
          );
        })
      )
      .subscribe((productsWithCategoryNames) => {
        this.productsAll = productsWithCategoryNames;
      });
    this.fetchingProducts = false;
  }

  returnToCategories() {
    this.showCategoriesTEMPLATE = true;
    this.showProductsInCategoriesSwitcherTEMPLATE = true;
    this.showProductsAllTEMPLATE = false;
    this.showProductsByCategoryTEMPLATE = false;
  }

  addToCart(product: IProduct) {
    this.cartService.addToCart(product);
  }

  textTruncate(product: any) {
    product.isDescriptionTrancated = !product.isDescriptionTrancated;
  }
}
