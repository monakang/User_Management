import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { MatFormField, MatLabel } from '@angular/material/input';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { SearchResultsComponent } from '../search-results/search-results.component';
import { User } from '../../user/user.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { UserService } from '../../user/user.service';
import { TableColumn } from '../table.module';
import { userColumns } from '../table-config.json';

@Component({
  selector: 'app-user-search',
  imports: [
    MatButtonModule,

    MatFormField,
    MatLabel,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    SearchResultsComponent,
  ],
  templateUrl: './user-search.component.html',
  styleUrl: './user-search.component.css',
})
export class UserSearchComponent {
  userSearchForm!: FormGroup;
  Users: User[] = [];
  dataSource = new MatTableDataSource<User>();
  isLoading: boolean = false;

  searchValue: string = '';
  searchType: string = 'name';
  userColumns: TableColumn[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userColumns = userColumns;
    this.userSearchForm = new FormGroup({
      userName: new FormControl(null),
    });
  }
  onFormSubmit() {
    if (this.userSearchForm.valid) {
      this.searchValue = this.userSearchForm.value.userName;
      this.loadAndFilterData();
    }
  }
  ngOnChanges() {
    this.searchValue = this.userSearchForm.value.userName;
  }

  loadAndFilterData(): void {
    if (!this.searchValue) {
      this.dataSource.data = [];
      return;
    }

    this.isLoading = true;
    this.userService.getAllUsers().subscribe({
      next: (data: any) => {
        this.dataSource.data = data.filter((user: any) =>
          user[this.searchType]
            ?.toString()
            .toLowerCase()
            .includes(this.searchValue.toLowerCase()),
        );
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.dataSource.data = [];
      },
    });
  }
}
