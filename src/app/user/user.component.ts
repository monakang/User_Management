import {
  Component,
  computed,
  inject,
  input,
  effect,
  OnInit,
  Optional,
  signal,
  ViewChild,
  Input,
} from '@angular/core';
import { User } from './user.model';

import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

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
import { NewUserUpdate } from '../new-user/newUserUpdate.service';
import { NewUserComponent } from '../new-user/new-user.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { servicesVersion } from 'typescript';

import { GenericTableComponent } from '../generic-table/generic-table.component';

@Component({
  selector: 'app-user',
  imports: [
    MatTableModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,

    MatPaginatorModule,
    MatIconModule,
    MatToolbarModule,
    RouterLink,
    RouterOutlet,
    GenericTableComponent,
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent implements OnInit {
  constructor(
    @Optional() private _dialogRef: MatDialog,
    private userService: UserService,
    private newUserUpdateService: NewUserUpdate,
    private activatedRoute: ActivatedRoute = inject(ActivatedRoute),
  ) {
    // Automatically updates the data property whenever users() emits
    effect(() => {
      this.dataSource.data = this.users();
    });
  }

  Users: User[] = [];

  displayedColumns: string[] = [
    'name',
    'email',
    'gender',
    'jobTitle',
    'action',
  ];

  users = input.required<User[]>();
  dataSource = new MatTableDataSource<User>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  //@ViewChild(MatSort) sort!: MatSort;

  userForm!: FormGroup;

  ngOnInit() {
    // this.userForm = new FormGroup({
    //   name: new FormControl(null, Validators.required),
    //   email: new FormControl(null, [Validators.required, Validators.email]),
    //   gender: new FormControl('Male', Validators.required),
    // });

    this.getUserList();
    this.newUserUpdateService.refreshTable$.subscribe(() => {
      this.getUserList(); // Re-fetch from API and update MatTableDataSource
    });
  }

  /*Commenting for using Dialog Form Component instead
  // onAddUser() {
  //   const dialogRef = this._dialogRef.open(NewUserComponent, {
  //     width: '700px',
  //     height: '400px',
  //   });
  //   dialogRef.afterClosed().subscribe({
  //     next: (val: any) => {
  //       if (val) {
  //         this.getUserList();
  //       } else {
  //         console.log('Dialog closed without value');
  //       }
  //     },
  //   });
  //   console.log("Navigating to 'new' route for adding a user");
  // }
  */

  // To get the user list from the service and assign it to the data source for the table
  getUserList() {
    this.userService.getAllUsers().subscribe({
      next: (val: any) => {
        this.Users = val;
        this.dataSource.data = this.Users;
        //this.dataSource.paginator = this.paginator;  --Handled in child component
        // this.dataSource.sort = this.sort;
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

  deleteUser(id: number) {
    this.userService.deleteUser(id).subscribe({
      next: (val: any) => {
        this.getUserList(); // Refresh the user list after deleting a user
      },
      error: console.log,
    });
  }

  /* Edit with the Wrapper Component 
  editUserForm(data: any) {
    // console.log('Editing user:', data);
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
  }*/
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
