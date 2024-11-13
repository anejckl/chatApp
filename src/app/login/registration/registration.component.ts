import { Component, OnInit, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import {
  RegistrationRequest,
  RegistrationResponse,
} from '../../models/auth.models';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  registrationForm!: FormGroup;
  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;
  isLoading: boolean = false;

  private _adminService = inject(AdminService);
  private dialogRef = inject(MatDialogRef<RegistrationComponent>);

  ngOnInit(): void {
    this.registrationForm = new FormGroup(
      {
        username: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
        ]),
        confirmPassword: new FormControl('', [Validators.required]),
      },
      { validators: this.passwordMatchValidator }
    );
  }

  createUser(): void {
    this.isLoading = true;
    const { username, email, password } = this.registrationForm.value;

    const registrationData: RegistrationRequest = {
      username,
      email,
      password,
    };

    this._adminService.registerUser(registrationData).subscribe((response: RegistrationResponse) => {
        this.isLoading = false;
        this.dialogRef.close(response);
      });
  }

  closeRegistration(event: Event): void {
    event.preventDefault();
    this.dialogRef.close();
  }

  passwordMatchValidator: ValidatorFn = (
    group: AbstractControl
  ): { [key: string]: any } | null => {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  };
}
