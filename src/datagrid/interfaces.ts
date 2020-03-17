import { CustomElement, CustomAttribute } from '@aurelia/runtime';

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
  width: number;
  offsetX?: number;
  animationX?: Animation;
  deltaX?: number;
  animate?(el: HTMLElement): void;
  dragged?: boolean;
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
  virtual: IVirtualState;

  useVirtual(): void;
  sortOn(c: IColumnDefinition, multi?: boolean): void;
  select(item: any): void;
}

export type IConfigurableVirtualState = Omit<IVirtualState, 'topGap' | 'bottomGap' | 'setState' | 'index' | 'count'>;

export interface IVirtualState<T = any> {

  scrollTop: number;
  rowHeight: number;
  buffer: number;
  topGap: number;
  bottomGap: number;
  index: number;
  count: number;

  setState(newState: Partial<IConfigurableVirtualState>): void;
  calc(data: any[]): any[];
}

window['CustomElement'] = CustomElement;
window['CustomAttribute'] = CustomAttribute;