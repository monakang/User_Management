import { Component } from '@angular/core';
//import { RouterOutlet } from '@angular/router';

import { UserComponent } from './user/user.component';
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-root',
  imports: [UserComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'ReactiveForm';
}
