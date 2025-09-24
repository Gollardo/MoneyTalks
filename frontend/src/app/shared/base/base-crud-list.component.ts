import { Directive, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { WritableSignal, signal } from "@angular/core";

export interface Identifiable {
  id: string;
}

@Directive()
export abstract class BaseCrudListComponent<T extends Identifiable>
  implements OnInit
{
  items: WritableSignal<T[]> = signal([]);
  selected: T | null = null;
  pagination = { total: 1, page: 1, hasMore: false };
  form!: FormGroup;
  modal: any;
  isFormEdit = false;
  formErrors: WritableSignal<string> = signal("");

  constructor(protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
    this.load();
  }

  abstract buildForm(): void;
  abstract getService(): any;

  load(page: number = 1): void {
    this.formErrors.set("");
    this.getService()
      .getAll(page)
      .subscribe({
        next: (data: any) => {
          if (page > 1) {
            this.items.update((items) => [...items, ...data.data]);
          } else {
            this.items.set(data.data);
          }

          this.pagination.total = data.total;
          this.pagination.page = data.page;
          this.pagination.hasMore = data.hasMore;
        },
        error: (error: any) => console.error(error),
      });
  }

  save(): void {
    if (this.isFormEdit && this.selected) {
      const updated = { ...this.selected, ...this.form.value };
      this.getService()
        .update(this.selected["id"], updated)
        .subscribe({
          next: () => this.afterSubmitSuccess(),
          error: (e: any) => this.handleError(e),
        });
    } else {
      const created = { ...this.form.value };
      this.getService()
        .create(created)
        .subscribe({
          next: () => this.afterSubmitSuccess(),
          error: (e: any) => this.handleError(e),
        });
    }
  }

  delete(): void {
    if (!this.selected) return;
    this.getService()
      .delete(this.selected["id"])
      .subscribe({
        next: () => this.afterSubmitSuccess(),
        error: (e: any) => this.handleError(e),
      });
  }

  protected afterSubmitSuccess() {
    this.modal?.hide();
    this.load();
  }

  protected handleError(e: any) {
    this.formErrors.set(e.error?.message?.message || "Произошла ошибка");
  }

  selectRow(row: T) {
    this.selected = { ...row };
    this.form.patchValue({ ...this.selected });
    this.isFormEdit = true;
    this.modal?.show();
  }

  createNew() {
    this.selected = null;
    this.form.reset();
    this.isFormEdit = false;
    this.modal?.show();
  }

  cancel() {
    this.selected = null;
    this.form.reset();
    this.modal?.hide();
  }
}
