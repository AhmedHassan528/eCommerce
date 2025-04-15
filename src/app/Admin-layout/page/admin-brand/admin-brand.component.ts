import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../../core/services/Categories/category.service';
import { BrandsService } from '../../../core/services/BrandsServices/brands.service';
import {IBrands} from '../../../core/Interfaces/ibrands' ;
import {ICategories} from '../../../core/Interfaces/icategories' ;
import { CommonModule } from '@angular/common';
import { SidebarComponent } from "../../shared/components/sidebar/sidebar.component";
import { TranslateModule } from '@ngx-translate/core';
@Component({
    selector: 'app-admin-brand',
    imports: [CommonModule, FormsModule, ReactiveFormsModule, SidebarComponent, TranslateModule],
    templateUrl: './admin-brand.component.html',
    styleUrl: './admin-brand.component.scss'
})

export class AdminBrandComponent implements OnInit {
  brands: IBrands[] = [];
  selectedBrand: IBrands = { Id: 0, Name: '', Image: '' };
  selectedImageFile: File | null = null;
  imageError: string | null = null;
  isEditMode: boolean = false;

  @ViewChild('crudModal', { static: false }) crudModal!: ElementRef;

  brandForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    image: new FormControl('')
  });

  constructor(private brandService: BrandsService) {}

  ngOnInit(): void {
    this.loadBrands();
  }

  loadBrands(): void {
    this.brandService.getAllBrands().subscribe({
      next: (brands) => this.brands = brands.$values,
      error: (error) => console.error('Error loading brands:', error)
    });
  }

  onCreate(): void {
    this.selectedBrand = { Id: 0, Name: '', Image: '' };
    this.selectedImageFile = null;
    this.imageError = null;
    this.isEditMode = false;
    this.brandForm.reset({
      name: '',
      image: ''
    });
    this.toggleModal(true);
  }

  onEdit(brand: IBrands): void {
    this.selectedBrand = { ...brand };
    this.selectedImageFile = null;
    this.imageError = null;
    this.isEditMode = true;
    this.brandForm.patchValue({
      name: brand.Name
    });
    this.toggleModal(true);
  }

  onImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validImageTypes.includes(file.type)) {
        this.imageError = 'Please upload a valid image file (JPEG, PNG, or GIF)';
        this.selectedImageFile = null;
        return;
      }
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        this.imageError = 'Image file size must be less than 5MB';
        this.selectedImageFile = null;
        return;
      }
      this.imageError = null;
      this.selectedImageFile = file;
    } else {
      this.selectedImageFile = null;
      this.imageError = 'Please select an image file';
    }
  }

  onSubmit(): void {
    if (this.brandForm.valid && !this.imageError) {
        const formData = new FormData();
        const name = this.brandForm.get('name')!.value?.trim() ?? '';

        if (!name) {
            this.brandForm.get('name')?.setErrors({ required: true });
            return;
        }

        if (!this.selectedImageFile && !this.isEditMode) {
            this.imageError = 'Please select an image file';
            return;
        }

        formData.append('Name', name);
        if (this.selectedImageFile) {
            formData.append('imageFile', this.selectedImageFile, this.selectedImageFile.name);
        }

        if (this.isEditMode && this.selectedBrand.Id) {
            this.brandService.updateBrand(this.selectedBrand.Id, formData).subscribe({
                next: (response) => {
                    const updatedBrand = response.body as IBrands;
                    const index = this.brands.findIndex(b => b.Id === updatedBrand.Id);
                    if (index !== -1) this.brands[index] = updatedBrand;
                    this.resetForm();
                    this.toggleModal(false);
                    alert('Brand updated successfully');
                },
                error: (error) => {
                    console.error('Error updating brand:', error);
                    
                    // Extract error message from the server response
                    let errorMessage = 'Failed to update brand. Please try again.';
                    
                    if (error.error) {
                        if (typeof error.error === 'string') {
                            try {
                                const errorObj = JSON.parse(error.error);
                                if (errorObj && errorObj.message) {
                                    errorMessage = errorObj.message;
                                }
                            } catch (e) {
                                errorMessage = error.error;
                            }
                        } else if (error.error.imageFile) {
                            errorMessage = error.error.imageFile[0];
                        } else if (error.error.Name) {
                            errorMessage = error.error.Name[0];
                        }
                    }
                    
                    this.imageError = errorMessage;
                    alert(errorMessage);
                }
            });
        } else {
            this.brandService.createBrand(formData).subscribe({
                next: (response) => {
                    const newBrand = response.body as IBrands;
                    this.brands.push(newBrand);
                    this.resetForm();
                    this.toggleModal(false);
                    alert('Brand created successfully');
                },
                error: (error) => {
                    console.error('Error creating brand:', error);
                    
                    // Extract error message from the server response
                    let errorMessage = 'Failed to create brand. Please try again.';
                    
                    if (error.error) {
                        if (typeof error.error === 'string') {
                            try {
                                const errorObj = JSON.parse(error.error);
                                if (errorObj && errorObj.message) {
                                    errorMessage = errorObj.message;
                                }
                            } catch (e) {
                                errorMessage = error.error;
                            }
                        } else if (error.error.imageFile) {
                            errorMessage = error.error.imageFile[0];
                        } else if (error.error.Name) {
                            errorMessage = error.error.Name[0];
                        }
                    }
                    
                    this.imageError = errorMessage;
                    alert(errorMessage);
                }
            });
        }
    } else {
        if (this.brandForm.get('name')?.invalid) {
            this.brandForm.get('name')?.markAsTouched();
        }
        if (!this.selectedImageFile && !this.isEditMode) {
            this.imageError = 'Please select an image file';
        }
    }
}

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this brand?')) {
      this.brandService.deleteBrand(id).subscribe({
        next: (response) => {
          if (response.status === 200 || response.status === 204) {
            this.brands = this.brands.filter(b => b.Id !== id);
            alert('Brand deleted successfully');
          }
        },
        error: (error) => {
          console.error('Error deleting brand:', error);
          
          alert('There was an error deleting the brand. This might be due to a server issue with file handling. Please try again later or contact support.');
          
          this.loadBrands();
        }
      });
    }
  }

  resetForm(): void {
    this.selectedBrand = { Id: 0, Name: '', Image: '' };
    this.brandForm.reset({
      name: '',
      image: ''
    });
    this.selectedImageFile = null;
    this.imageError = null;
    this.isEditMode = false;
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