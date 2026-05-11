import { Component, Input } from '@angular/core';
import { User } from '../../user/user.model';
import { UserService } from '../../user/user.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TitleCasePipe } from '../../pipe/title-case.pipe';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-search-results',
  imports: [MatTableModule, TitleCasePipe, MatPaginatorModule],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.css',
})
export class SearchResultsComponent {
  @Input() searchValue: string = '';
  @Input() searchType: string = '';

  Users: User[] = [];
  dataSource = new MatTableDataSource<User>();

  displayedColumns: string[] = ['id', 'name', 'email', 'gender', 'jobTitle'];

  isLoading: boolean = false;
  constructor(private userService: UserService) {}

  ngOnChanges() {
    if (this.searchValue) {
      this.isLoading = true;
      this.loadAndFilterData();
    }
  }

  //To load and filter data based on search value and type
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
