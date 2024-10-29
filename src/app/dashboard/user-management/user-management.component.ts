import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from '../../models/auth.models';
import { AdminService } from '../../services/admin.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent {
  private _adminService = inject(AdminService);
  private _snackBarService = inject(SnackbarService);

  displayedColumns: string[] = ['id', 'username', 'email', 'role', 'actions'];
  dataSource = this._adminService.getUsers();

  dialog = inject(MatDialog);

  editUser(user: User): void {
    
  }

  deleteUser(user: User): void {
    this._adminService.deleteUser(user.id).subscribe(response => {
        this._snackBarService.success(response);
    });
  }
}
