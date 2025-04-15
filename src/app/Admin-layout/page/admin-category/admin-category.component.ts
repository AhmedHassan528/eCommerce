import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../../core/services/Categories/category.service';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from "../../shared/components/sidebar/sidebar.component";
import { ICategories } from '../../../core/Interfaces/icategories';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-admin-category',
    imports: [CommonModule, FormsModule, ReactiveFormsModule, SidebarComponent, TranslateModule],
    templateUrl: './admin-category.component.html'
})
export class AdminCategoryComponent implements OnInit {
  categories: ICategories[] = [];
  isEditMode = false;
  selectedCategoryId: number | null = null;
  imageError: string = '';
  coverImage: File | null = null;

  @ViewChild('crudModal') crudModal!: ElementRef;

  categoryForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(50)]),
  });

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => this.categories = categories.$values,
      error: (error) => console.error('Error loading categories:', error)
    });
  }

  onCreate() {
    this.isEditMode = false;
    this.selectedCategoryId = null;
    this.categoryForm.reset();
    this.coverImage = null;
    this.imageError = '';
    this.showModal();
  }

  onEdit(category: ICategories) {
    this.isEditMode = true;
    this.selectedCategoryId = category.Id;
    this.categoryForm.patchValue({
      name: category.Name
    });
    this.showModal();
  }

  onDelete(id: number) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          this.loadCategories();
        },
        error: (error) => console.error('Error deleting category:', error)
      });
    }
  }

  onCoverImageChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type.startsWith('image/')) {
        this.coverImage = file;
        this.imageError = '';
      } else {
        this.imageError = 'Please select a valid image file';
        this.coverImage = null;
      }
    }
  }

  onSubmit() {
    if (this.categoryForm.valid && !this.imageError) {
      const formData = new FormData();
      const name = this.categoryForm.get('name')?.value || '';
      
      // Ensure name is not empty
      if (!name.trim()) {
        alert('Category name is required');
        return;
      }
      
      formData.append('Name', name);
      
      // For new categories, image is required
      if (!this.isEditMode && !this.coverImage) {
        this.imageError = 'Image is required for new categories';
        return;
      }
      
      // Append image if available
      if (this.coverImage) {
        formData.append('ImageFiles', this.coverImage);
      }

      if (this.isEditMode && this.selectedCategoryId) {
        // Update existing category
        this.categoryService.updateCategory(this.selectedCategoryId, formData).subscribe({
          next: () => {
            this.loadCategories();
            this.closeModal();
          },
          error: (error) => {
            console.error('Error updating category:', error);
            if (error.error) {
              alert(error.error.title || 'Failed to update category. Please try again.');
            }
          }
        });
      } else {
        // Create new category
        this.categoryService.createCategory(formData).subscribe({
          next: () => {
            this.loadCategories();
            this.closeModal();
          },
          error: (error) => {
            console.error('Error creating category:', error);
            if (error.error) {
              alert(error.error.title || 'Failed to create category. Please try again.');
            }
          }
        });
      }
    }
  }

  showModal() {
    this.crudModal.nativeElement.classList.remove('hidden');
  }

  closeModal() {
    this.crudModal.nativeElement.classList.add('hidden');
    this.categoryForm.reset();
    this.coverImage = null;
    this.imageError = '';
  }
} 