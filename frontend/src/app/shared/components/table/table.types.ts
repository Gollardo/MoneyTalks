import { TemplateRef } from "@angular/core";

export interface TableColumn<T = any> {
  key: string;
  title: string;
  sortable?: boolean;
  filterable?: boolean;
  searchable?: boolean;
  template?: TemplateRef<any>; // кастомная отрисовка
  class?: string; // кастомные стили
}

export interface TablePagination {
  total: number;
  page: number;
  hasMore: boolean;
}

export interface TableSort {
  active: string;
  direction: "asc" | "desc";
}
