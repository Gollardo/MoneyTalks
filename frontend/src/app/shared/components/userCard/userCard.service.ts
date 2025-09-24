import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { User } from "../../../models/user.model";

@Injectable({ providedIn: "root" })
export class UserCardService {
  private readonly apiUrl = environment.apiUrl + "/users";

  constructor(private http: HttpClient) {}

  getUser(id: string): Observable<User | null> {
    return this.http.get<User | null>(`${this.apiUrl}/${id}`);
  }

  updateUser(id: string, data: Partial<User>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, data);
  }

  changePassword(
    id: string,
    data: {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    },
  ): Observable<User | null> {
    return this.http.patch<User | null>(`${this.apiUrl}/change-password`, data);
  }
}
