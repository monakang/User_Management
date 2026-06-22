import { Component, OnInit } from '@angular/core';
import { NewUserComponent } from '../new-user/new-user.component';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { NewUserUpdate } from '../new-user/newUserUpdate.service';

@Component({
  selector: 'app-user-dialog',

  templateUrl: './user-dialog.component.html',
  styleUrl: './user-dialog.component.css',
})
export class UserDialogComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private newUserUpdateService: NewUserUpdate,
  ) {}

  ngOnInit(): void {
    const dialogRef = this.dialog.open(NewUserComponent, {
      width: '500px',
      disableClose: true,

      data: this.route.snapshot.params['id'],
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.router.navigate(['/user'], { relativeTo: this.route });
      if (result === true) {
        this.newUserUpdateService.notifyTableRefresh();
      }
    });
  }
}
