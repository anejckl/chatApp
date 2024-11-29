import { Injectable, inject } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private _snackBar = inject(MatSnackBar);

  public error(message: string, action?: string) {
    return this._snackBar.open(message, action, {
      panelClass: ['snackbar-error'],
      duration: 3000
    });
  }

  public success(message: string, action?: string) {
    return this._snackBar.open(message, action, {
      panelClass: ['snackbar-success'],
      duration: 3000
    });
  }

  public info(message: string, action?: string) {
    return this._snackBar.open(message, action, {
      panelClass: ['snackbar-info'],
      duration: 3000
    });
  }
}