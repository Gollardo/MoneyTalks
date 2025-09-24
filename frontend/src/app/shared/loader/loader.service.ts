import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: "root" })
export class LoaderService {
  private _loading = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this._loading.asObservable();

  private activeRequests = 0;
  private showTimer: any;
  private readonly SHOW_DELAY = 100; // задержка на появление в мс
  private readonly MIN_DISPLAY_TIME = 300; // минимальное время показа

  show() {
    this.activeRequests++;
    if (!this.showTimer && !this._loading.value) {
      // ставим таймер на появление спиннера
      this.showTimer = setTimeout(() => {
        this._loading.next(true);
        this.showTimer = null;
      }, this.SHOW_DELAY);
    }
  }

  hide() {
    this.activeRequests--;
    if (this.activeRequests <= 0) {
      // отменяем таймер появления, если спиннер ещё не показался
      if (this.showTimer) {
        clearTimeout(this.showTimer);
        this.showTimer = null;
      }

      // скрытие спиннера с учётом минимального времени показа
      if (this._loading.value) {
        setTimeout(() => this._loading.next(false), this.MIN_DISPLAY_TIME);
      }

      this.activeRequests = 0;
    }
  }
}
