import { Component, OnInit } from '@angular/core';
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
  selector: 'app-job-search',
  imports: [
    MatButtonModule,
    MatTableModule,
    MatFormField,
    MatLabel,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    SearchResultsComponent,
  ],
  templateUrl: './job-search.component.html',
  styleUrl: './job-search.component.css',
})
export class JobSearchComponent implements OnInit {
  jobSearchForm!: FormGroup;
  Users: User[] = [];
  dataSource = new MatTableDataSource<User>();
  isLoading: boolean = false;

  searchValue: string = '';
  searchType: string = 'jobTitle';
  userColumns: TableColumn[] = [];

  constructor(private userService: UserService) {}
  ngOnInit() {
    this.userColumns = userColumns;
    this.jobSearchForm = new FormGroup({
      jobTitle: new FormControl(null),
    });
  }
  onFormSubmit() {
    if (this.jobSearchForm.valid) {
      this.searchValue = this.jobSearchForm.value.jobTitle;
      this.loadAndFilterData();
    }
  }
  ngOnChanges() {
    this.searchValue = this.jobSearchForm.value.jobTitle;
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
