import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ICategory } from '../../shared/classes/types';
import { ProductService } from '../../shared/services/product.service';
import { CardModule, GridModule, SpinnerModule } from '@coreui/angular';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [CardModule, SpinnerModule, CommonModule, RouterLink, GridModule],
  templateUrl: './product-page.component.html',
})
export class ProductPageComponent implements OnInit {
  categories$!: Observable<ICategory[]>;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.categories$ = this.productService.fetchCategories();
  }
}
