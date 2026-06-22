import {
  Component,
  inject,
  input,
  effect,
  OnInit,
  Optional,
  signal,
  ViewChild,
} from '@angular/core';
import { User } from './user.model';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { UserService } from './user.service';
import { NewUserUpdate } from '../new-user/newUserUpdate.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';

import { GenericTableComponent } from '../generic-table/generic-table.component';
import { UserDetailsComponent } from '../user-details/user-details/user-details.component';
import { CanComponentDeactivate } from '../auth/can-deactive.guard';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    MatTableModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatIconModule,
    MatToolbarModule,
    GenericTableComponent,
    UserDetailsComponent,
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent implements OnInit, CanComponentDeactivate {
  // 1. Implemented the guard interface
  showUserDetails = signal<boolean>(false);
  selectedUser = signal<User | null>(null);

  // 2. Query reference to the inline form component instance
  @ViewChild(UserDetailsComponent) userDetailsChild!: UserDetailsComponent;

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
  userForm!: FormGroup;

  private activatedRoute = inject(ActivatedRoute);

  constructor(
    @Optional() private _dialogRef: MatDialog,
    private userService: UserService,
    private newUserUpdateService: NewUserUpdate,
  ) {
    effect(() => {
      this.dataSource.data = this.users();
    });
  }

  ngOnInit() {
    this.getUserList();
    this.newUserUpdateService.refreshTable$.subscribe(() => {
      this.getUserList();
    });
    this.selectedUser.set(null);
    this.showUserDetails.set(false);
  }

  // 3. This method intercepts routing exits (like the Back Button)
  canDeactivate(): boolean {
    // If the form drawer is active, force validation down to the child's dirty form state
    if (this.showUserDetails() && this.userDetailsChild) {
      return this.userDetailsChild.canDeactivate();
    }
    return true;
  }

  onEditUser(user: User) {
    this.selectedUser.set(user);
    this.showUserDetails.set(true);
  }

  // 4. Updated to safely handle explicit UI closing triggers
  onCloseDetails() {
    if (this.userDetailsChild && !this.userDetailsChild.canDeactivate()) {
      return; // Stop and keep form open if user clicks "Cancel" on the confirmation pop-up
    }
    this.selectedUser.set(null);
    this.showUserDetails.set(false);
  }

  getUserList() {
    this.userService.getAllUsers().subscribe({
      next: (val: any) => {
        this.Users = val;
        this.dataSource.data = this.Users;
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
        this.getUserList();
      },
      error: console.log,
    });
  }
}
