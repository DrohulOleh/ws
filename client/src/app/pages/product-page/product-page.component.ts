import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Observable, switchMap, map, Subscription } from 'rxjs';
import { EUserRoles, ICategory, IProduct } from '../../shared/classes/types';
import { ProductService } from '../../shared/services/product.service';
import {
  ButtonModule,
  CardModule,
  FormModule,
  GridModule,
  ModalModule,
  SpinnerModule,
} from '@coreui/angular';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconModule } from '@coreui/icons-angular';
import { CartService } from '../../shared/services/cart.service';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    CommonModule,
    FormModule,
    FormsModule,
    GridModule,
    IconModule,
    ReactiveFormsModule,
    RouterLink,
    SpinnerModule,
    ModalModule,
  ],
  templateUrl: './product-page.component.html',
})
export class ProductPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('modalEditCategory') modalEditCategoryRef!: ElementRef;
  @ViewChild('fileInput') fileInputRef!: ElementRef;

  categories$!: Observable<ICategory[]>;
  productsAll: IProduct[] = [];
  productsInCategories: IProduct[] = [];
  selectedCategoryId = '';
  selectedCategoryName = '';
  selectedCategory!: ICategory;
  currentUserId = this.authService.getUserPayload()?.userId;
  currentUserIsAdmin =
    this.authService.getUserPayload()?.role === EUserRoles.admin ? true : false;

  modalEditCategoryVisible = false;
  modalEditProductVisible = false;

  formEditCategory: FormGroup | any;
  formCreateProduct: FormGroup | any;
  editCategorySubscription!: Subscription | any;
  image!: File;
  imagePreview: any = '';

  productSubscription!: Subscription;

  fetchingProducts = false;

  showCategoriesTEMPLATE = true;
  showProductsInCategoriesSwitcherTEMPLATE = true;
  showProductsAllTEMPLATE = false;
  showProductsByCategoryTEMPLATE = false;

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.categories$ = this.productService.fetchCategories();
  }

  ngAfterViewInit(): void {}

  showProductsByCategory(categoryId: string, categoryName: string) {
    this.showCategoriesTEMPLATE = false;
    this.showProductsInCategoriesSwitcherTEMPLATE = false;
    this.showProductsByCategoryTEMPLATE = true;

    this.fetchingProducts = true;
    this.selectedCategoryId = categoryId;
    this.selectedCategoryName = categoryName;

    this.productSubscription = this.productService
      .fetchProductsByCategoryId(categoryId)
      .subscribe({
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

    this.productSubscription = this.productService
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

  addToCart(product: IProduct, userId: string) {
    this.cartService.addToCart(product, this.currentUserId);
  }

  editCategory(category: ICategory) {
    this.selectedCategory = category;
    this.toggleModalEditCategory();

    this.formEditCategory = new FormGroup({
      categoryName: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
      ]),
    });

    this.formEditCategory.disable();

    if (category._id) {
      this.editCategorySubscription = this.productService
        .fetchCategoryById(category._id)
        .subscribe({
          next: (category) => {
            this.formEditCategory.patchValue({ categoryName: category.name });
            this.imagePreview = category.imageSrc;
          },
          error: (err) => {
            console.log(err);
          },
          complete: () => {
            this.formEditCategory.enable();
          },
        });
    }
  }

  editProduct(productId: string) {
    console.log('editProduct', productId);
  }

  addProduct() {
    console.log('addProduct');
  }

  textTruncate(product: any) {
    product.isDescriptionTrancated = !product.isDescriptionTrancated;
  }

  toggleModalEditCategory() {
    this.modalEditCategoryVisible = !this.modalEditCategoryVisible;
  }

  onSubmitEditCategory() {
    let obs$;

    this.formEditCategory.disable();

    if (this.selectedCategory._id) {
      obs$ = this.productService
        .updateCategory(
          this.selectedCategory._id,
          this.formEditCategory.value.categoryName,
          this.image
        )
        .subscribe({
          next: () => {
            console.log('updated');
            this.formEditCategory.enable();
            this.toggleModalEditCategory();
            this.categories$ = this.productService.fetchCategories();
          },
          error: (err) => {
            console.log(err);
            this.formEditCategory.enable();
          },
        });
    }
  }

  onFileUpload(event: any) {
    const file = event.target.files[0];
    this.image = file;

    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview = reader.result;
    };

    reader.readAsDataURL(file);
  }

  triggerClick() {
    this.fileInputRef.nativeElement.click();
  }

  ngOnDestroy(): void {
    if (this.productSubscription) this.productSubscription.unsubscribe();
  }
}
