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
  ButtonGroupModule,
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
    ButtonGroupModule,
  ],
  templateUrl: './product-page.component.html',
})
export class ProductPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('modalEditCategory') modalEditCategoryRef!: ElementRef;
  @ViewChild('modalEditProduct') modalEditProductRef!: ElementRef;
  @ViewChild('fileInput') fileInputRef!: ElementRef;
  @ViewChild('imageInput') imageInputRef!: ElementRef;

  categories$!: Observable<ICategory[]>;
  productsAll: IProduct[] = [];
  productsInCategories: IProduct[] = [];
  selectedCategoryId = '';
  selectedCategoryName = '';
  selectedCategory!: ICategory;
  selectedProductId!: null | any;
  currentUserId = this.authService.getUserPayload()?.userId;
  currentUserIsAdmin =
    this.authService.getUserPayload()?.role === EUserRoles.admin ? true : false;

  modalEditCategoryVisible = false;
  modalEditProductVisible = false;
  blockAddCategoryVisible = false;

  formEditCategory: FormGroup | any;
  formAddCategory: FormGroup | any;
  formEditProduct: FormGroup | any;
  editCategorySubscription!: Subscription | any;
  image!: File;
  imagePreview: any = '';
  imageCategoryAdd!: File;
  imageCategoryAddPreview: any = '';
  noImage: any = 'uploads/no_image.png';

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

  editProduct(product: IProduct) {
    this.imagePreview = '';
    this.selectedProductId = product._id;
    console.log('editProduct', product);

    this.formEditProduct = new FormGroup({
      productName: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
      ]),
      productCost: new FormControl(null, [
        Validators.required,
        Validators.min(0.01),
      ]),
      productUnit: new FormControl(null, [Validators.required]),
      productDescription: new FormControl(null, [Validators.required]),
      productCategory: new FormControl(null, [Validators.required]),
    });

    this.formAddCategory = new FormGroup({
      categoryName: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
      ]),
    });

    this.toggleModalEditProduct();

    //this.formEditProduct.disable();

    this.formEditProduct.patchValue({
      productName: product.name,
      productCost: product.cost,
      productUnit: product.unit,
      productDescription: product.description,
      productCategory: product.category,
    });
    this.imagePreview = product.imageSrc;
  }

  addProduct() {
    this.imagePreview = '';
    this.selectedProductId = null;

    this.formEditProduct = new FormGroup({
      productName: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
      ]),
      productCost: new FormControl(null, [
        Validators.required,
        Validators.min(0.01),
      ]),
      productUnit: new FormControl(null, [Validators.required]),
      productDescription: new FormControl(null, [Validators.required]),
      productCategory: new FormControl(null, [Validators.required]),
    });

    this.formAddCategory = new FormGroup({
      categoryName: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
      ]),
    });

    this.toggleModalEditProduct();
  }

  deleteProduct(product: IProduct) {
    const decision = window.confirm(
      `Are you sure you want to delete the '${product.name}' product?`
    );

    if (decision) {
      this.productSubscription = this.productService
        .deleteProduct(product)
        .subscribe({
          next: (response) => {
            const idx = this.productsAll.findIndex(
              (p) => p._id === product._id
            );
            this.productsAll.splice(idx, 1);
            console.log(response.message);
            this.returnToCategories();
          },
          error: (err) => {
            console.log(err);
          },
        });
    }
  }

  textTruncate(product: any) {
    product.isDescriptionTrancated = !product.isDescriptionTrancated;
  }

  toggleModalEditCategory() {
    this.modalEditCategoryVisible = !this.modalEditCategoryVisible;
  }

  toggleModalEditProduct() {
    this.modalEditProductVisible = !this.modalEditProductVisible;
  }

  toggleAddCategoryBlock() {
    this.blockAddCategoryVisible = !this.blockAddCategoryVisible;
    this.formAddCategory.reset();
    this.imageCategoryAddPreview = '';
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

  onSubmitAddCategory() {
    let obs$;

    this.formAddCategory.disable();

    obs$ = this.productService
      .createCategory(
        this.formAddCategory.value.categoryName,
        this.imageCategoryAdd
      )
      .subscribe({
        next: () => {
          //console.log('added');
          this.toggleAddCategoryBlock();
          this.formAddCategory.enable();
          this.categories$ = this.productService.fetchCategories();
        },
        error: (err) => {
          console.log(err.error.message);
          this.formAddCategory.enable();
        },
      });
  }

  onSubmitAddProduct() {
    this.formEditProduct.disable();

    const newProduct: IProduct = {
      category: this.formEditProduct.value.productCategory,
      cost: this.formEditProduct.value.productCost,
      description: this.formEditProduct.value.productDescription,
      name: this.formEditProduct.value.productName,
      unit: this.formEditProduct.value.productUnit,
    };

    if (this.selectedProductId) {
      newProduct._id = this.selectedProductId;

      this.productSubscription = this.productService
        .updateProduct(newProduct, this.image)
        .subscribe({
          next: (product) => {
            const idx = this.productsAll.findIndex(
              (p) => p._id === product._id
            );
            this.productsAll[idx] = product;
            console.log('Cahanges saved');
            this.formEditProduct.enable();
            this.toggleModalEditProduct();

            this.returnToCategories();
          },
        });
    } else {
      this.productSubscription = this.productService
        .createProduct(newProduct, this.image)
        .subscribe({
          next: (product) => {
            this.productsAll.push(product);

            this.formEditProduct.enable();
            this.toggleModalEditProduct();

            this.returnToCategories();
          },
          error: (err) => {
            console.log(err);
            this.formEditProduct.enable();
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
    //console.log(file);
  }

  onFileUploadCategoryAdd(event: any) {
    const file = event.target.files[0];
    this.imageCategoryAdd = file;

    const reader = new FileReader();

    reader.onload = () => {
      this.imageCategoryAddPreview = reader.result;
    };

    reader.readAsDataURL(file);
    console.log(this.imageCategoryAddPreview);
  }

  triggerClick() {
    this.fileInputRef.nativeElement.click();
  }

  triggerAddCategoryImageClick() {
    this.imageInputRef.nativeElement.click();
  }

  ngOnDestroy(): void {
    if (this.productSubscription) this.productSubscription.unsubscribe();
    if (this.editCategorySubscription)
      this.editCategorySubscription.unsubscribe();
  }
}
