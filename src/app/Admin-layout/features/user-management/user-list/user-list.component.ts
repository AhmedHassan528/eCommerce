import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../../core/services/UserServices/user.service';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { TranslateModule } from '@ngx-translate/core';
import { IUser } from '../../../../core/Interfaces/iuser';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-user-list',
    imports: [CommonModule, FormsModule, SidebarComponent, TranslateModule],
    templateUrl: './user-list.component.html',
    styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
  users: IUser[] = [];
  filteredUsers: IUser[] = [];
  searchTerm: string = '';
  isLoading: boolean = false;
  selectedRole: string = 'all';

  constructor(
    private userService: UserService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe({
      next: (response) => {
        this.isLoading = false;
        this.users = response.$values || [];
        this.filterUsers();
      },
      error: (error) => {
        this.isLoading = false;
        this.toastrService.error('admin.users.error', 'Error', {
          timeOut: 2000,
        });
      }
    });
  }

  filterUsers(): void {
    let filtered = [...this.users];

    // Filter by search term
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(user => 
        user.FirstName.toLowerCase().includes(searchLower) ||
        user.LastName.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.PhoneNumber.includes(this.searchTerm)
      );
    }

    // Filter by role
    if (this.selectedRole !== 'all') {
      filtered = filtered.filter(user => 
        user.UserRoles.$values.includes(this.selectedRole)
      );
    }

    this.filteredUsers = filtered;
  }

  onSearch(): void {
    this.filterUsers();
  }

  onRoleChange(role: string): void {
    this.selectedRole = role;
    this.filterUsers();
  }
} 