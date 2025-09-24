import { Component, EventEmitter, Input, Output } from "@angular/core";
import { TableColumn, TablePagination } from "./table.types";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-table",
  templateUrl: "./table.component.html",
  standalone: true,
  imports: [CommonModule],
})
export class TableComponent<T = any> {
  @Input() data: Record<string, any>[] = [];
  @Input() columns: TableColumn<T>[] = [];
  @Input() isSearchable: boolean = false;

  // Пагинация
  @Input() pagination: TablePagination = { total: 1, page: 1, hasMore: false };
  @Output() paginationChange = new EventEmitter<number>();

  @Input() loading = false;

  // Поиск
  @Output() searchChange = new EventEmitter<string>();

  @Output() rowSelected = new EventEmitter<any>();
  @Output() create = new EventEmitter<void>();

  onPageChange() {
    this.paginationChange.emit(this.pagination.page + 1);
  }

  onSearchChange(event: any) {
    this.pagination.hasMore = false;
    this.searchChange.emit(event.target.value);
  }

  onRowSelected(row: any) {
    this.rowSelected.emit(row);
  }
}
