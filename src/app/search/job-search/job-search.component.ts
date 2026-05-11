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
  selector: 'app-job-search',
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
  templateUrl: './job-search.component.html',
  styleUrl: './job-search.component.css',
})
export class JobSearchComponent {
  jobSearchForm!: FormGroup;
  submittedSearchType: string = '';
  submittedSearchValue: string = '';

  ngOnInit() {
    this.jobSearchForm = new FormGroup({
      jobTitle: new FormControl(null),
    });
  }
  onFormSubmit() {
    if (this.jobSearchForm.valid) {
      console.log(this.jobSearchForm.value);
      this.submittedSearchType = 'jobTitle';
      this.submittedSearchValue = this.jobSearchForm.value.jobTitle;
    }
  }
}
