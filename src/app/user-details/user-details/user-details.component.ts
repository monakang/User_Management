import {
  Component,
  HostListener,
  inject,
  input,
  output,
  effect,
  AfterViewInit,
  ElementRef,
} from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { UserService } from '../../user/user.service';
import { User } from '../../user/user.model';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSelectModule,
    MatDividerModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css',
})
export class UserDetailsComponent implements AfterViewInit {
  private userService = inject(UserService);

  // 1. Outputs to notify the parent component
  saveSuccess = output<void>();
  cancel = output<void>();
  data: any;

  // 2. React smoothly to input changes using an Input Signal
  user = input<User | null>(null);
  isSaved = false;

  // 3. Initialize the form directly to avoid undefined timing issues with effects
  userForm = new FormGroup({
    id: new FormControl<number | null>(null), // Hidden tracker for updating
    name: new FormControl<string | null>(null, Validators.required),
    email: new FormControl<string | null>(null, [
      Validators.required,
      Validators.email,
    ]),
    gender: new FormControl<string>('Male'),
    jobTitle: new FormControl<string | null>(null, Validators.required),
  });

  constructor(private el: ElementRef) {
    // 4. This effect triggers AUTOMATICALLY whenever the 'user' input changes
    effect(() => {
      const currentUser = this.user();
      if (currentUser) {
        this.userForm.patchValue(currentUser);
        this.userForm.markAsPristine(); // Mark clean so deactivation guards know it's untouched
        this.data = currentUser; // Update the data property for template binding
      } else {
        this.userForm.reset({ gender: 'Male' });
      }
    });
  }

  // Lifecycle hook that runs once the component UI is completely rendered
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.el.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });

      // Slight extra 20px adjustment buffer downward
      window.scrollBy({ top: -20, behavior: 'smooth' });
    }, 150);
  }

  // 5. Consolidated submission logic
  onSubmit(): void {
    if (this.userForm.valid) {
      this.isSaved = true;
      const formData = this.userForm.value as User;

      // Determine Add vs Update based on whether an ID exists
      const request$ = formData.id
        ? this.userService.updateUser(formData.id, formData)
        : this.userService.addUser(formData);

      request$.subscribe({
        next: () => {
          this.saveSuccess.emit(); // Tell parent to refresh table and close form
        },
        error: (err) => {
          this.isSaved = false;
          console.error('Error saving user data:', err);
        },
      });
    }
  }

  @HostListener('keydown.escape', ['$event'])
  onKeydownHandler(event: Event) {
    this.onCancel();
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: BeforeUnloadEvent): void {
    if (!this.userForm.pristine && !this.isSaved) {
      $event.returnValue = true;
    }
  }

  canDeactivate(): boolean {
    console.log(
      'Checking if can deactivate. Form pristine:',
      this.userForm.pristine,
      'Is saved:',
      this.isSaved,
    );
    // If the form has no changes or was already successfully saved, let them pass
    if (this.userForm.pristine) {
      return true;
    }
    // Otherwise, prompt the user
    return confirm('You have unsaved changes! Are you sure you want to leave?');
  }

  onCancel(): void {
    if (!this.canDeactivate()) {
      return; // If they click 'Cancel' on the popup, STOP right here. Form stays open!
    }

    // Only reset and close if the guard passed (Form clean or user clicked 'OK')
    this.userForm.reset({ gender: 'Male' });
    this.cancel.emit(); // Optional: You can also call this to trigger the same logic as route deactivation
  }
}
