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

  displayedColumns: string[] = ['id', 'value', 'created', 'status', 'actions'];
  dataSource = new MatTableDataSource<Key>();

  ngOnInit(): void {
    this.fetchKeys();
  }

  public setStatus(key: Key): void {
    this._adminService.updateKeys(key.id, !key.status).subscribe((response) => {
      this._snackBarService.info(response.message, 'OK');

      key.status = !key.status;
      this.dataSource.data = [...this.dataSource.data];
    });


  }

  private fetchKeys(): void {
    this._adminService.getKeys().subscribe((keys: Key[]) => {
        this.dataSource.data = keys;
    });
  }
}
