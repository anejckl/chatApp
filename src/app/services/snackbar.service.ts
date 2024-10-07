import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
    private _snackBar = inject(MatSnackBar);

    public openSnackBar(message: string): void {
        this._snackBar.open(message, 'OK', {duration: 3000});
    }
}
