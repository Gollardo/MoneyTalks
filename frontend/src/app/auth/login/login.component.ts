import { CommonModule } from "@angular/common";
import { Component, OnInit, signal, WritableSignal } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  loading = false;
  error: WritableSignal<string | null> = signal(null);
  mask: string | null = null;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
  ) {
    this.form = this.fb.group({
      identifier: ["", Validators.required],
      password: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(["/"]);
    }
  }

  submit() {
    if (this.form.invalid) return;

    this.loading = true;
    const { identifier, password } = this.form.value;

    if (!identifier || !password) return;

    this.auth.login({ identifier, password }).subscribe({
      next: ({ accessToken }) => {
        this.auth.saveToken(accessToken);
        window.location.reload();
        this.router.navigate(["/"]);
      },
      error: (err) => {
        this.loading = false;
        if (err?.error?.message) {
          this.error.set(err.error.message.message);
        } else {
          this.error.set("Ошибка при авторизации. Повторите попытку.");
        }
      },
    });
  }
}
