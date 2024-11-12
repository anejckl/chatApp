import { Component, inject, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Key } from '../../models/admin.model';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-api-keys',
  templateUrl: './api-keys.component.html',
  styleUrl: './api-keys.component.scss'
})
export class ApiKeysComponent implements OnInit {
  private _adminService = inject(AdminService);

  displayedColumns: string[] = ['id', 'value', 'created', 'status', 'actions'];
  dataSource = new MatTableDataSource<Key>();

  ngOnInit(): void {
    this.fetchKeys();
  }

  private fetchKeys(): void {
    this._adminService.getKeys().subscribe(
      (keys: Key[]) => {
        this.dataSource.data = keys;
      });
  }

}
