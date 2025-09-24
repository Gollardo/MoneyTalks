import { Injectable } from "@angular/core";
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Observable, catchError, finalize, throwError } from "rxjs";
import { LoaderService } from "./loader.service";

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  constructor(private loaderService: LoaderService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    this.loaderService.show();
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // Здесь можно логировать ошибку или показывать уведомление
        console.error("HTTP Error:", error);
        return throwError(() => error);
      }),
      finalize(() => {
        // Спиннер скрывается всегда, независимо от успеха или ошибки
        this.loaderService.hide();
      }),
    );
  }
}
