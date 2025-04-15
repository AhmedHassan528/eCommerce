import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../../core/services/UserServices/user.service';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-make-admin',
    imports: [CommonModule, ReactiveFormsModule, SidebarComponent, TranslateModule],
    templateUrl: './make-admin.component.html',
    styleUrl: './make-admin.component.scss'
})
export class MakeAdminComponent implements OnInit {
  adminForm: FormGroup;
  isLoading = false;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService
  ) {
    this.adminForm = this.formBuilder.group({
      userEmail: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.adminForm.valid) {
      this.isLoading = true;
      const userEmail = this.adminForm.get('userEmail')?.value;
      
      this.userService.makeUserAdmin(userEmail).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.toastrService.success('admin.makeAdmin.success', 'Success', {
            timeOut: 2000,
          });
          this.adminForm.reset();
        },
        error: (error) => {
          this.isLoading = false;
          this.toastrService.error('admin.makeAdmin.error', 'Error', {
            timeOut: 2000,
          });
        }
      });
    }
  }
} 