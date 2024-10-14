import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
    private _snackBar = inject(MatSnackBar);
    private actionOK = 'OK'

    public error(message: string) {
      return this._snackBar.open(message, this.actionOK, {panelClass: ['snackbar-error']});
    }
  
    public success(message: string) {
      return this._snackBar.open(message, this.actionOK, {panelClass: ['snackbar-success']});
    }
  
    public info(message: string) {
      return this._snackBar.open(message, this.actionOK, {panelClass: ['snackbar-info']});
    }
}
