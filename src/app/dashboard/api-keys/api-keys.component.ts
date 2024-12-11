import { Component, inject, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Key } from '../../models/admin.model';
import { AdminService } from '../../services/admin.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-api-keys',
  templateUrl: './api-keys.component.html',
  styleUrl: './api-keys.component.scss'
})
export class ApiKeysComponent implements OnInit {
  private _adminService = inject(AdminService);
  private _snackBarService = inject(SnackbarService);

  displayedColumns: string[] = ['id', 'value', 'created', 'status', 'test', 'actions'];
  dataSource = new MatTableDataSource<Key>();

  ngOnInit(): void {
    this.fetchKeys();
  }

  public setStatus(key: Key): void {
    const newStatus = !key.status;
    this._adminService.updateKeys(key.id, newStatus).subscribe((response) => {
      this._snackBarService.info(response.message, 'OK');
      key.status = newStatus;
      this.dataSource.data = [...this.dataSource.data]; // Trigger change detection
    });
  }
  
  private fetchKeys(): void {
    this._adminService.getKeys().subscribe((keys: Key[]) => {
        this.dataSource.data = keys;
    });
  }
}
