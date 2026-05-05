import {
  AfterViewInit,
  ViewChild,
  Component,
  input,
  Input,
  output,
} from '@angular/core';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { User } from '../user/user.model';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { HighlightSearchDirective } from '../directive/highlight-search.directive';

import { TitleCasePipe } from '../pipe/title-case.pipe';
@Component({
  selector: 'app-generic-table',
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
    RouterLink,
    HighlightSearchDirective,
    TitleCasePipe,
  ],
  templateUrl: './generic-table.component.html',
  styleUrl: './generic-table.component.css',
})
export class GenericTableComponent {
  myDataSource = input.required<MatTableDataSource<User>>();
  searchText: string = '';

  // This function runs automatically the second the paginator appears in HTML
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    if (mp) {
      // Link the paginator to the current value of the signal
      this.myDataSource().paginator = mp;
    }
  }
  @ViewChild(MatSort) set matSort(ms: MatSort) {
    if (ms) {
      this.myDataSource().sort = ms;
    }
  }
  @Input() displayedColumns: string[] = [];
  // 1. Declare output signals for parent to handle

  delete = output<any>();

  // 2. Methods to emit the data back to parent

  onDeleteUser(row: any) {
    this.delete.emit(row);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchText = filterValue.trim().toLowerCase();
    this.myDataSource().filter = filterValue.trim().toLowerCase();

    if (this.myDataSource().paginator) {
      this.myDataSource().paginator?.firstPage();
    }
  }
}
