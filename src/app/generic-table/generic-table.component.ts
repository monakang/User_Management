import {
  Component,
  input,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router'; // You can remove this if no longer routing
import { User } from '../user/user.model';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { HighlightSearchDirective } from '../directive/highlight-search.directive';
import { TitleCasePipe } from '../pipe/title-case.pipe';

@Component({
  selector: 'app-generic-table',
  standalone: true,
  imports: [
    MatTableModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatToolbarModule,

    HighlightSearchDirective,
    TitleCasePipe,
  ],
  templateUrl: './generic-table.component.html',
  styleUrl: './generic-table.component.css',
})
export class GenericTableComponent {
  // Inputs
  myDataSource = input.required<MatTableDataSource<User>>();
  @Input() displayedColumns: string[] = [];

  searchText: string = '';

  // Outputs - Ensure these are only declared ONCE
  @Output() edit = new EventEmitter<User>();
  @Output() delete = new EventEmitter<number>();

  // ViewChild setters for Paginator and Sort
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    if (mp) {
      this.myDataSource().paginator = mp;
    }
  }

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    if (ms) {
      this.myDataSource().sort = ms;
    }
  }

  // --- Methods ---

  onEditClick(row: any) {
    console.log('Edit button clicked for user:', row);
    this.edit.emit(row);
  }

  onDeleteUser(id: number) {
    console.log('Delete button clicked for user:', id);
    this.delete.emit(id);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchText = filterValue.trim().toLowerCase();
    this.myDataSource().filter = this.searchText;

    if (this.myDataSource().paginator) {
      this.myDataSource().paginator?.firstPage();
    }
  }
}
