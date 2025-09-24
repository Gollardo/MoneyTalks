import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { JwtHelperService } from "@auth0/angular-jwt";
import { environment } from "../../environments/environment";
import { Router } from "@angular/router";
import { catchError, defer, Observable, of, tap } from "rxjs";
import { User } from "../models/user.model";

@Injectable({ providedIn: "root" })
export class AuthService {
  private apiUrl = environment.apiUrl + "/auth";
  private jwtHelper = new JwtHelperService();

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  login(credentials: { identifier: string; password: string }) {
    return this.http.post<{ accessToken: string }>(
      `${this.apiUrl}/login`,
      credentials,
    );
  }

  saveToken(token: string) {
    localStorage.setItem("access_token", token);
  }

  getToken(): string | null {
    return localStorage.getItem("access_token");
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && !this.jwtHelper.isTokenExpired(token);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(["/login"]);
  }

  getUserInfo() {
    const token = this.getToken();
    return token ? this.jwtHelper.decodeToken(token) : null;
  }

  getUserFromBackend(id: string): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/users/` + id);
  }

  getUserInfoFromLocalStorage(): Observable<User> {
    const token = this.getUserInfo();
    if (!token) {
      const emptyUser: User = {
        id: "",
        login: "Unknown User",
      };
      return of(emptyUser);
    }

    return defer(() => {
      const cached = localStorage.getItem("user-info");
      if (cached) {
        try {
          const user: User = JSON.parse(cached);
          return of(user);
        } catch {
          localStorage.removeItem("user-info");
        }
      }

      return this.getUserFromBackend(token.sub).pipe(
        tap((user) => {
          localStorage.setItem("user-info", JSON.stringify(user));
        }),
        catchError((err) => {
          console.error("Ошибка при получении пользователя", err);
          return of({
            login: "Unknown User",
          } as unknown as User);
        }),
      );
    });
  }
}
