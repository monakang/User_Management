import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from './user.model';

import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from './user.service';
import { NewUserComponent } from '../new-user/new-user.component';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-user',
  imports: [
    MatTableModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatToolbarModule,
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent implements OnInit {
  constructor(
    private _dialogRef: MatDialog,
    private userService: UserService,
  ) {}

  Users: User[] = [];

  displayedColumns: string[] = ['name', 'email', 'gender', 'action'];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  userForm!: FormGroup;

  ngOnInit() {
    this.userForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      gender: new FormControl('Male', Validators.required),
    });

    this.getUserList();
  }
  onAddUser() {
    const dialogRef = this._dialogRef.open(NewUserComponent, {
      width: '700px',
      height: '400px',
    });
    dialogRef.afterClosed().subscribe({
      next: (val: any) => {
        if (val) {
          this.getUserList();
        } else {
          console.log('Dialog closed without value');
        }
      },
    });
  }

  // To get the user list from the service and assign it to the data source for the table
  getUserList() {
    console.log('Fetching user list...');
    this.userService.getAllUsers().subscribe({
      next: (val: any) => {
        this.Users = val;
        this.dataSource = new MatTableDataSource(this.Users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: console.log,
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteUser(id: string) {
    this.userService.deleteUser(id).subscribe({
      next: (val: any) => {
        console.log('User deleted successfully:', id);
        this.getUserList(); // Refresh the user list after deleting a user
      },
      error: console.log,
    });
  }

  editUserForm(data: any) {
    const dialogRef = this._dialogRef.open(NewUserComponent, {
      data,
      width: '700px',
      height: '400px',
    });
    dialogRef.afterClosed().subscribe({
      next: (val: any) => {
        if (val) {
          this.getUserList();
        } else {
          console.log('Dialog closed without value');
        }
      },
    });
  }
  /* To set the value 
   this.userForm.setValue({
      name: 'John Doe',
      email: 'john.doe@example.com',
      gender: 'Male',
    });
  */
  /* this.userForm.valueChanges.subscribe((value) => {
      console.log('Form Value Changed:', value);
    });
    this.userForm.statusChanges.subscribe((value) => {
      console.log('Form Status Changed:', value);
    }); */
}
