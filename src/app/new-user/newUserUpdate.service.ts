import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class NewUserUpdate {
  private refreshTableSource = new Subject<void>();
  refreshTable$ = this.refreshTableSource.asObservable();

  notifyTableRefresh() {
    this.refreshTableSource.next();
  }
}
