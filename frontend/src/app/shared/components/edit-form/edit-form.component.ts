import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-edit-form",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./edit-form.component.html",
})
export class EditFormComponent {
  @Input() modalId!: string;
  @Input() title: string = "Форма";
  @Input() isEditMode = false;
  @Input() errorString = "";
  @Input() isFormValid: boolean = false;
  @Input() isCanDelete = false;

  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
}
