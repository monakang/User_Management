import {
  Component,
  OnInit,
  Inject,
  inject,
  Optional,
  HostListener,
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
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CanComponentDeactivate } from '../auth/can-deactive.guard';

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
export class NewUserComponent implements OnInit, CanComponentDeactivate {
  private router = inject(Router);

  userForm!: FormGroup;
  isSaved = false;

  constructor(
    private userService: UserService,
    @Optional() private _dialogRef: MatDialogRef<NewUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

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

  @HostListener('keydown.escape', ['$event'])
  onKeydownHandler(event: any) {
    this.onCancel();
  }

  onCancel() {
    if (this.canDeactivate()) {
      this.close();
    }
  }

  canDeactivate(): boolean {
    if (this.userForm.pristine || this.isSaved) {
      return true;
    }
    return confirm('You have unsaved changes! Are you sure you want to leave?');
  }

  private close() {
    if (this._dialogRef) {
      this._dialogRef.close();
    } else {
      this.router.navigate(['/user']);
    }
  }

  onFormSubmit() {
    if (this.userForm.valid) {
      this.isSaved = true;
      const request$ = this.data
        ? this.userService.updateUser(this.data, this.userForm.value)
        : this.userService.addUser(this.userForm.value);

      request$.subscribe({
        next: () => {
          this.close();
        },
        error: console.log,
      });
    }
  }

  getUserbyId(id: number) {
    this.userService.GetUserById(id).subscribe((Userdata) => {
      this.userForm.patchValue(Userdata);
    });
  }
}
