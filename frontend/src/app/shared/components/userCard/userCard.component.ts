import { CommonModule } from "@angular/common";
import {
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
  WritableSignal,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { NavigationEnd, Router } from "@angular/router";
import { AuthService } from "../../../auth/auth.service";
import { User } from "../../../models/user.model";
import { passwordsMatchValidator } from "./passwordsMatchValidator";
import { UserCardService } from "./userCard.service";

@Component({
  selector: "app-user-card",
  templateUrl: "./userCard.component.html",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class UserCardComponent {
  user: User | null;
  errorString: WritableSignal<string> = signal("");
  mainForm!: FormGroup;
  passwordForm!: FormGroup;
  activeTab: string = "profile";

  @Input() modalId: string = "";
  @Output() closeEvent = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private service: UserCardService,
    private authService: AuthService,
    private router: Router,
  ) {
    this.user = null;
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.urlAfterRedirects === "/") {
          this.getUser();
        }
      }
    });

    this.mainForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      fullName: ["", [Validators.required, Validators.minLength(3)]],
      phone: ["", [Validators.pattern(/^[\d+()\-\s]+$/)]],
      telegrameChatId: [""],
    });

    this.passwordForm = this.fb.group(
      {
        currentPassword: ["", [Validators.required]],
        newPassword: ["", [Validators.required, Validators.minLength(8)]],
        confirmPassword: ["", [Validators.required, Validators.minLength(8)]],
      },
      { validators: passwordsMatchValidator },
    );
  }

  getUser(): void {
    const userInfo = this.authService.getUserInfo();
    if (userInfo) {
      this.service.getUser(userInfo.sub).subscribe({
        next: (user: User | null) => {
          this.user = user;
          if (user) this.mainForm.patchValue(user);
        },
        error: (e) => {
          console.log(e.error?.message || "Произошла ошибка");
        },
      });
    }
  }

  updateUser(): void {
    if (this.mainForm.valid) {
      const userInfo = this.authService.getUserInfo();
      this.service.updateUser(userInfo.sub, this.mainForm.value).subscribe({
        next: () => {
          this.closeEvent.emit();
        },
        error: (e: any) => {
          this.errorString.set(e.error?.message || "Произошла ошибка");
        },
      });
    }
  }

  changePassword(): void {
    const userInfo = this.authService.getUserInfo();
    this.service
      .changePassword(userInfo.sub, this.passwordForm.value)
      .subscribe({
        next: (user: User | null) => {
          this.user = user;
          if (user) this.mainForm.patchValue(user);
          this.passwordForm.reset();
          this.closeEvent.emit();
        },
        error: (e: any) => {
          this.errorString.set(e.error?.message || "Произошла ошибка");
        },
      });
  }
}
