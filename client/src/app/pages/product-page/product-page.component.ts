import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
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

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    CollapseModule,
    CommonModule,
    GridModule,
    RouterLink,
    SpinnerModule,
    FormModule,
  ],
  templateUrl: './product-page.component.html',
})
export class ProductPageComponent implements OnInit {
  categories$!: Observable<ICategory[]>;
  productsAll: IProduct[] = [];
  productsInCategories: IProduct[] = [];
  selectedCategoryId = '';

  fetchingProducts = false;

  showCategoriesTEMPLATE = true;
  showProductsInCategoriesSwitcherTEMPLATE = true;
  showProductsAllTEMPLATE = false;
  showProductsByCategoryTEMPLATE = false;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.categories$ = this.productService.fetchCategories();
  }

  showProductByCategory(categoryId: string) {
    this.showCategoriesTEMPLATE = !this.showCategoriesTEMPLATE;
    this.showProductsInCategoriesSwitcherTEMPLATE =
      !this.showProductsInCategoriesSwitcherTEMPLATE;
    this.showProductsByCategoryTEMPLATE = !this.showProductsByCategoryTEMPLATE;

    this.fetchingProducts = true;
    this.selectedCategoryId = categoryId;

    this.productService.fetchProductsByCategoryId(categoryId).subscribe({
      next: (productsInCategories) => {
        this.productsInCategories = productsInCategories;
        this.fetchingProducts = false;
        console.log(productsInCategories);
      },
    });
  }

  showAllProducts() {
    this.showCategoriesTEMPLATE = !this.showCategoriesTEMPLATE;
    this.showProductsAllTEMPLATE = !this.showProductsAllTEMPLATE;
    
    this.fetchingProducts = true;

    this.productService.fetchProducts().subscribe({
      next: (productsAll) => {
        this.productsAll = productsAll.sort((a, b) =>
          a.name > b.name ? 1 : -1
        );
        this.fetchingProducts = false;
      },
    });
  }

  /* showProductsInCategoriesToggler() {
    this.showCategoriesTEMPLATE = !this.showCategoriesTEMPLATE;
    this.showProductsInCategoriesSwitcher =
      !this.showProductsInCategoriesSwitcher;
    this.showProductsAll = !this.showProductsAll;
    console.log('showMainContent', this.showCategoriesTEMPLATE);
    console.log('showProducts', this.showProductsAll);
    console.log('showCategoriesToggle', this.showProductsInCategoriesSwitcher);
  } */
}
