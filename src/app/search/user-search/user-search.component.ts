import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { MatFormField, MatLabel } from '@angular/material/input';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { SearchResultsComponent } from '../search-results/search-results.component';

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
  submittedSearchType: string = '';
  submittedSearchValue: string = '';

  ngOnInit() {
    this.userSearchForm = new FormGroup({
      userName: new FormControl(null),
    });
  }
  onFormSubmit() {
    if (this.userSearchForm.valid) {
      console.log(this.userSearchForm.value);
      this.submittedSearchType = 'name';
      this.submittedSearchValue = this.userSearchForm.value.userName;
    }
  }
}
