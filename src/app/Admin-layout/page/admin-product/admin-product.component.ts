import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ItemService } from '../../../core/services/Items-Service/item.service';
import { CategoryService } from '../../../core/services/Categories/category.service';
import { BrandsService } from '../../../core/services/BrandsServices/brands.service';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from "../../shared/components/sidebar/sidebar.component";
import { ICategories } from '../../../core/Interfaces/icategories';
import { IBrands } from '../../../core/Interfaces/ibrands';
import { IProduct } from '../../../core/Interfaces/product';
import { KMPSearchPipe } from '../../../core/Pipes/kmpsearch.pipe';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-admin-product',
    imports: [CommonModule, FormsModule, ReactiveFormsModule, SidebarComponent, KMPSearchPipe, TranslateModule],
    templateUrl: './admin-product.component.html',
    styleUrl: './admin-product.component.scss'
})
export class AdminProductComponent implements OnInit {
  products: IProduct[] = [];
  categories: ICategories[] = [];
  brands: IBrands[] = [];
  selectedProduct: IProduct | null = null;
  selectedImageFiles: File[] = [];
  selectedCoverImage: File | null = null;
  imageError: string | null = null;
  isEditMode: boolean = false;
  searchTerm: string = '';

  @ViewChild('crudModal', { static: false }) crudModal!: ElementRef;

  productForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    description: new FormControl('', [Validators.required, Validators.maxLength(500)]),
    price: new FormControl(0, [Validators.required, Validators.min(0)]),
    NumSold: new FormControl(0, [Validators.required, Validators.min(0)]),
    ratingsQuantity: new FormControl(0, [Validators.required, Validators.min(0)]),
    category: new FormControl<number | null>(null),
    Brand: new FormControl<number | null>(null),
    coverImage: new FormControl<File | null>(null, [Validators.required]),
    additionalImages: new FormControl<File[]>([])
  });

  constructor(
    private productService: ItemService,
    private categoryService: CategoryService,
    private brandService: BrandsService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
    this.loadBrands();
  }

  loadProducts(): void {
    this.productService.getAdminItems().subscribe({
      next: (products: any) => this.products = products.$values,
      error: (error: any) => console.error('Error loading products:', error)
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => this.categories = categories.$values,
      error: (error) => console.error('Error loading categories:', error)
    });
  }

  loadBrands(): void {
    this.brandService.getAllBrands().subscribe({
      next: (brands) => this.brands = brands.$values,
      error: (error) => console.error('Error loading brands:', error)
    });
  }

  getCategoryName(categoryId: number | undefined): string {
    if (!categoryId) return 'N/A';
    const category = this.categories.find(c => c.Id === categoryId);
    return category ? category.Name : 'N/A';
  }

  getBrandName(brandId: number | undefined): string {
    if (!brandId) return 'N/A';
    const brand = this.brands.find(b => b.Id === brandId);
    return brand ? brand.Name : 'N/A';
  }

  onCreate(): void {
    this.selectedProduct = null;
    this.selectedImageFiles = [];
    this.selectedCoverImage = null;
    this.imageError = null;
    this.isEditMode = false;
    this.productForm.reset({
      title: '',
      description: '',
      price: 0,
      NumSold: 0,
      ratingsQuantity: 0,
      category: null,
      Brand: null,
      coverImage: null,
      additionalImages: []
    });
    this.toggleModal(true);
  }

  onEdit(product: IProduct): void {
    this.selectedProduct = { ...product };
    this.selectedImageFiles = [];
    this.selectedCoverImage = null;
    this.imageError = null;
    this.isEditMode = true;
    this.productForm.patchValue({
      title: product.Title,
      description: product.Description,
      price: product.Price,
      NumSold: product.NumSold,
      ratingsQuantity: product.RatingsQuantity,
      category: product.Category?.Id || null,
      Brand: product.Brand?.Id || null,
      coverImage: null,
      additionalImages: []
    });
    this.toggleModal(true);
  }

  onImageChange(event: any): void {
    const files = event.target.files;
    if (files) {
      this.selectedImageFiles = Array.from(files);
      this.validateImages(this.selectedImageFiles);
      this.productForm.patchValue({
        additionalImages: this.selectedImageFiles
      });
    }
  }

  onCoverImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.validateCoverImage(file);
      this.selectedCoverImage = file;
      this.productForm.patchValue({
        coverImage: file
      });
    }
  }

  validateImages(files: File[]): void {
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];

    for (const file of files) {
      if (!validImageTypes.includes(file.type)) {
        this.imageError = 'Please upload valid image files (JPEG, PNG, or GIF)';
        this.selectedImageFiles = [];
        return;
      }
    }
    this.imageError = null;
  }

  validateCoverImage(file: File): void {
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];

    if (!validImageTypes.includes(file.type)) {
      this.imageError = 'Please upload a valid cover image (JPEG, PNG, or GIF)';
      this.selectedCoverImage = null;
      return;
    }
    this.imageError = null;
  }

  onSubmit(): void {
    if (this.productForm.valid && !this.imageError) {
      const formValue = this.productForm.value;
      
      // Validate required fields
      if (!formValue.title?.trim()) {
        this.imageError = 'Title is required';
        return;
      }
      if (!formValue.description?.trim()) {
        this.imageError = 'Description is required';
        return;
      }

      // For new products, require images
      if (!this.isEditMode) {
        if (!this.selectedCoverImage) {
          this.imageError = 'Cover image is required';
          return;
        }
        if (this.selectedImageFiles.length === 0) {
          this.imageError = 'At least one product image is required';
          return;
        }
      }

      const formData = new FormData();
      
      // Append required fields
      formData.append('title', formValue.title.trim());
      formData.append('description', formValue.description.trim());
      formData.append('price', formValue.price?.toString() || '0');
      formData.append('NumSold', formValue.NumSold?.toString() || '0');
      formData.append('ratingsQuantity', formValue.ratingsQuantity?.toString() || '0');
      
      // Handle category and brand IDs
      if (formValue.category !== null && formValue.category !== undefined) {
        formData.append('categoryID', formValue.category.toString());
      }
      if (formValue.Brand !== null && formValue.Brand !== undefined) {
        formData.append('brandID', formValue.Brand.toString());
      }

      // Append cover image if selected
      if (this.selectedCoverImage) {
        formData.append('ImageCoverFile', this.selectedCoverImage);
      }
      
      // Append product images if selected
      if (this.selectedImageFiles.length > 0) {
        this.selectedImageFiles.forEach((file) => {
          formData.append('ImageFiles', file);
        });
      }

      if (this.isEditMode && this.selectedProduct) {
        this.productService.updateProduct(this.selectedProduct.Id, formData).subscribe({
          next: () => {
            this.loadProducts();
            this.resetForm();
            this.toggleModal(false);
          },
          error: (error: any) => {
            console.error('Error updating product:', error);
            this.imageError = error.error?.ImageFiles?.[0] || 'Failed to update product';
          }
        });
      } else {
        this.productService.createProduct(formData).subscribe({
          next: () => {
            this.loadProducts();
            this.resetForm();
            this.toggleModal(false);
          },
          error: (error: any) => {
            console.error('Error creating product:', error);
            this.imageError = error.error?.ImageFiles?.[0] || 'Failed to create product';
          }
        });
      }
    } else {
      this.imageError = 'Please fill in all required fields and upload the required images';
    }
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: (response) => {
          if (response.status === 200) {
            // Remove the deleted product from the local array
            this.products = this.products.filter(product => product.Id !== id);
          }
        },
        error: (error: any) => {
          console.error('Error deleting product:', error);
          // If the error is due to parsing but the status is 200, the delete was successful
          if (error.status === 200) {
            this.products = this.products.filter(product => product.Id !== id);
          }
        }
      });
    }
  }

  resetForm(): void {
    this.selectedProduct = null;
    this.selectedImageFiles = [];
    this.selectedCoverImage = null;
    this.imageError = null;
    this.isEditMode = false;
    this.productForm.reset({
      title: '',
      description: '',
      price: 0,
      NumSold: 0,
      ratingsQuantity: 0,
      category: null,
      Brand: null,
      coverImage: null,
      additionalImages: []
    });
  }

  toggleModal(open: boolean): void {
    if (this.crudModal && this.crudModal.nativeElement) {
      const modal = this.crudModal.nativeElement as HTMLElement;
      modal.classList.toggle('hidden', !open);
      if (open) {
        modal.focus();
      }
    }
  }

  closeModal(): void {
    this.toggleModal(false);
    this.resetForm();
  }
} 