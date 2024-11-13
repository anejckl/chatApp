import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Log } from '../../models/admin.model';
import { User } from '../../models/auth.models';
import { AdminService } from '../../services/admin.service';
import { SnackbarService } from '../../services/snackbar.service';
import { EditUserComponent } from './edit-user/edit-user.component';

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

  logsDataSource = new MatTableDataSource<Log>();
  logsDisplayedColumns: string[] = ['id', 'action', 'timestamp', 'ip_address', 'status', 'details'];


  users: User[] = [];
  selectedUser: User | null = null;


  dialog = inject(MatDialog);

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this._adminService.getUsers().subscribe((response: User[]) => {
      this.users = response;
      this.dataSource.data = this.users;
    });
  }

  editUser(user: User): void {
    const dialogRef = this.dialog.open(EditUserComponent, {
      width: '400px',
      data: user,
    });

    dialogRef.afterClosed().subscribe((updatedUser: User) => {
      this._adminService.updateUser(user.id, updatedUser).subscribe((response) => {
          this._snackBarService.success(response.message, 'OK');
          
          this.dataSource.data = this.users.map((u) =>
            u.id === user.id ? { ...u, ...updatedUser } : u
          );
        });
    });
  }

  selectUser(user: User): void {
    if (this.selectedUser === user) {
      this.selectedUser = null;
      this.logsDataSource.data = [];
    } else {
      this.selectedUser = user;
      this.fetchUserLogs(user.id);
    }
  }
  

  deleteUser(user: User): void {
    this._adminService.deleteUser(user.id).subscribe((response) => {
      this._snackBarService.success(response, 'OK');
      this.users = this.users.filter((u) => u.id !== user.id);
      this.dataSource.data = this.users;
    });
  }

  resetPassword(user: User): void {
    this._adminService.resetPassword(user.id).subscribe((response) => {
      this._snackBarService.success(response.message, 'OK');
    });
  }

  fetchUserLogs(userId: number): void {
    this._adminService.getUserLogs(userId).subscribe((logs) => {
        this.logsDataSource.data = logs;
    });
  }
}
