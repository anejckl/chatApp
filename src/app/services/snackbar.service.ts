import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
    private _snackBar = inject(MatSnackBar);

    public error(message: string, action?: string) {
      return this._snackBar.open(message, action, {panelClass: ['snackbar-error']});
    }
  
    public success(message: string, action?: string) {
      return this._snackBar.open(message, action, {panelClass: ['snackbar-success']});
    }
  
    public info(message: string, action?: string) {
      return this._snackBar.open(message, action, {panelClass: ['snackbar-info']});
    }
}
