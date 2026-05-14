import { Component, Input, OnChanges } from '@angular/core';
import { User } from '../../user/user.model';
import { UserService } from '../../user/user.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TitleCasePipe } from '../../pipe/title-case.pipe';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { TableColumn } from '../table.module';

@Component({
  selector: 'app-search-results',
  imports: [MatTableModule, TitleCasePipe, MatPaginatorModule],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.css',
})
export class SearchResultsComponent implements OnChanges {
  @Input() searchValue: string = '';
  @Input() searchType: string = '';
  @Input() data: any = [];
  @Input() columns: TableColumn[] = [];
  @Input() isLoading = false;

  dataSource = new MatTableDataSource<User>();
  displayedColumns: string[] = [];

  ngOnChanges() {
    this.displayedColumns = this.columns.map((col) => col.columnDef);
    this.dataSource.data = this.data;
  }
}
