import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `<h2 class="text-4xl font-extrabold dark:text-white mt-3 mb-4">
    Домашняя страница
  </h2>`,
})
export class HomePageComponent {}
