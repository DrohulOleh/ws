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
  products: IProduct[] = [];
  selectedCategoryId = '';

  loading = false;

  showMainContent = true;
  showCategoriesToggle = true;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.categories$ = this.productService.fetchCategories();
  }

  showProductByCategory(categoryId: string) {
    this.showMainContent = !this.showMainContent;
    this.showCategoriesToggle = !this.showCategoriesToggle;

    this.loading = true;
    this.selectedCategoryId = categoryId;

    this.productService.fetchProductsByCategoryId(categoryId).subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
    });
  }
}
