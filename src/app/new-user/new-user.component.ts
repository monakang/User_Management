import {
  Component,
  OnInit,
  Inject,
  Input,
  input,
  inject,
  Optional,
} from '@angular/core';
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
import { MatSelectModule } from '@angular/material/select';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';
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
    MatSelectModule,
  ],
  templateUrl: './new-user.component.html',
  styleUrl: './new-user.component.css',
})
export class NewUserComponent implements OnInit {
  private router = inject(Router);
  constructor(
    private userService: UserService,
    @Optional() private _dialogRef: MatDialogRef<NewUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}
  userForm!: FormGroup;
  User: User[] = [];

  ngOnInit() {
    this.userForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      gender: new FormControl('Male'),
      jobTitle: new FormControl(null, Validators.required),
    });

    if (this.data) {
      this.getUserbyId(this.data);
    }
  }

  onFormSubmit() {
    if (this.userForm.valid) {
      if (this.data) {
        this.userService.updateUser(this.data, this.userForm.value).subscribe({
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
      this.router.navigate(['/user']); // Navigate to the user list after form submission
    }
  }

  getUserbyId(id: number) {
    this.userService.GetUserById(id).subscribe((Userdata) => {
      this.userForm.patchValue(Userdata);
    });
  }
}
