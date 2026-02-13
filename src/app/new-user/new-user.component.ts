import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { UserService } from '../user/user.service';
import { User } from '../user/user.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
@Component({
  selector: 'app-new-user',
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRadioButton,
    MatRadioGroup,
  ],
  templateUrl: './new-user.component.html',
  styleUrl: './new-user.component.css',
})
export class NewUserComponent {
  constructor(
    private userService: UserService,
    private _dialogRef: MatDialogRef<NewUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}
  userForm!: FormGroup;
  Users: User[] = [];

  ngOnInit() {
    this.userForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      gender: new FormControl('Male'),
    });

    if (this.data) {
      this.userForm.patchValue(this.data);
    }
  }

  onFormSubmit() {
    if (this.userForm.valid) {
      if (this.data) {
        this.userService
          .updateUser(this.data.id, this.userForm.value)
          .subscribe({
            next: (val: any) => {
              this._dialogRef.close(true); //
            },
            error: console.log,
          });
      } else {
        this.userService.addUser(this.userForm.value).subscribe({
          next: (val: any) => {
            this._dialogRef.close(true); //
          },
          error: console.log,
        });
      }
    }
  }
}
