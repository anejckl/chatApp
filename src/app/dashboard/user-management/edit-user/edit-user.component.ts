import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../../models/auth.models';

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss'
})
export class EditUserComponent {
  dialogRef = inject(MatDialogRef<EditUserComponent>);
  data: User = inject(MAT_DIALOG_DATA);
  fb = inject(FormBuilder);

  editUserForm: FormGroup = this.fb.group({
    username: [this.data.username, Validators.required],
    mail: [this.data.mail, [Validators.required, Validators.email]],
    role_level: [this.data.role_level, Validators.required]
  });

  onSave(): void {
    if (this.editUserForm.valid) {
      this.dialogRef.close(this.editUserForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}