import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoginRequest, LoginResponse } from '../models/auth.models';
import { AuthenticationService } from '../services/authentication.service';
import { RegistrationComponent } from './registration/registration.component';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  hidePassword: boolean = true;
  isLoading: boolean = false;

  _authService = inject(AuthenticationService);

  private dialogRef = inject(MatDialogRef<LoginComponent>);

  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      rememberMe: new FormControl(false),
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { username, password, rememberMe } = this.loginForm.value;

      const loginData: LoginRequest = { username, password };

      this._authService
        .login(loginData)
        .subscribe((response: LoginResponse) => {
          this.isLoading = false;
          this.dialogRef.close(response);
        });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  openRegistration(): void {
    const dialogRef = this.dialog.open(RegistrationComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(result);
      }
    });
  }
}
