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
  selector: 'app-user-id-search',
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
  templateUrl: './user-id-search.component.html',
  styleUrl: './user-id-search.component.css',
})
export class UserIdSearchComponent {
  userIdSearchForm!: FormGroup;
  submittedSearchType: string = '';
  submittedSearchValue: string = '';

  ngOnInit() {
    this.userIdSearchForm = new FormGroup({
      userId: new FormControl(null),
    });
  }
  onFormSubmit() {
    if (this.userIdSearchForm.valid) {
      console.log(this.userIdSearchForm.value);
      this.submittedSearchType = 'id';
      this.submittedSearchValue = this.userIdSearchForm.value.userId;
    }
  }
}
