import { Routes } from "@angular/router";
import { LoginComponent } from "./auth/login/login.component";
import { authGuard } from "./auth/auth.guard";

export const routes: Routes = [
  { path: "login", component: LoginComponent },
  {
    path: "",
    loadComponent: () =>
      import("./pages/home/home.component").then((m) => m.HomePageComponent),
    canActivate: [authGuard],
  },
  { path: "**", redirectTo: "login" },
];
