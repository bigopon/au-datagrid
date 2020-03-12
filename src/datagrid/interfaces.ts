import { CustomElement, CustomAttribute } from '@aurelia/runtime';
import { IVirtualState } from './virtual';

export interface IColumnDefinition {
  name?: string;
  label?: string;
  /**
   * Data index of this column
   */
  data?: string;
  css?: string;
  resizable?: boolean;
  sortable?: boolean;
  searchable?: boolean;
  width?: number;
};

export interface IColumn extends IColumnDefinition {
  defaultWidth?: string;
  header?: string;
  render?: string;
}

export interface ISize {
  width: number;
  height: number;
}

export interface ISortColumn {
  column: IColumnDefinition;
  asc: number;
}

export interface IGridState {

  readonly items: any[];

  data: any[];
  size: ISize;
  columns: IColumn[];
  sort: ISortColumn[];
  search: string;

  useVirtual(virtual: IVirtualState): void;
  select(item: any): void;
}

window['CustomElement'] = CustomElement;
window['CustomAttribute'] = CustomAttribute;