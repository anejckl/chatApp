import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { User } from '../../models/auth.models';
import { AdminService } from '../../services/admin.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
})
export class UserManagementComponent implements OnInit {
  private _adminService = inject(AdminService);
  private _snackBarService = inject(SnackbarService);

  displayedColumns: string[] = ['id', 'username', 'email', 'role', 'actions'];
  dataSource = new MatTableDataSource<User>();
  users: User[] = [];

  dialog = inject(MatDialog);

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this._adminService.getUsers().subscribe((response) => {
      this.users = response;
      this.dataSource.data = this.users;
    });
  }

  editUser(user: User): void {

  }

  deleteUser(user: User): void {
    this._adminService.deleteUser(user.id).subscribe((response) => {
      this._snackBarService.success(response, 'OK');
      this.users = this.users.filter((u) => u.id !== user.id);
      this.dataSource.data = this.users;
    });
  }
}
