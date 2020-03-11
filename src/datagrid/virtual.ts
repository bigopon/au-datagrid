import { ISize, IGridState } from "./interfaces";
import { customAttribute, INode, bindable } from "aurelia";

export type IConfigurableVirtualState = Omit<IVirtualState, 'topGap' | 'bottomGap' | 'setState' | 'index' | 'count'>;

export interface IVirtualState<T = any> {
  data: T[];
  size: ISize;
  scrollTop: number;
  rowHeight: number;
  buffer: number;
  topGap: number;
  bottomGap: number;
  index: number;
  count: number;

  setState(newState: Partial<IConfigurableVirtualState>): void;
}

const defaultSize: ISize = { width: 0, height: 0 };

export class VirtualState<T = any> implements IVirtualState {

  private _data: T[];
  private _size: ISize;

  scrollTop = 0;
  rowHeight = 25;
  buffer = 4;
  topGap = 0;
  bottomGap = 0;
  index = 0;
  count = 0;

  constructor(
    data?: T[],
    size?: ISize,
  ) {
    this._data = data;
    this._size = size;
    this.calc();
  }

  get data(): T[] {
    return this._data;
  }
  set data(data: T[]) {
    this._data = data;
    this.calc();
  }

  get size(): ISize {
    return this._size;
  }
  set size(size: ISize) {
    this._size = size;
    this.calc();
  }

  setState(newState: Partial<IConfigurableVirtualState>): void {
    Object.assign(this, newState);
    this.calc();
  }

  private calc() {
    let {
      _data: data,
      buffer,
      rowHeight,
      scrollTop,
      _size: size
    } = this;
    // no data, reset
    if (!data) {
      size = defaultSize;
    }
    // Technically, size.height is slighty too high because it's the height of the full table, 
    // including thead, rather than just tbody.
    // That's not an issue though, it just means one or two extra rows will be rendered past the bottom.
    const length = data.length;
    const index = this.index = Math.max((scrollTop / rowHeight | 0) - buffer, 0);
    const count = this.count = Math.min((size.height / rowHeight | 0) + 1 + buffer + buffer, length - index);
    this.topGap = index * rowHeight;
    this.bottomGap = (length - count - index) * rowHeight;
  }
}

@customAttribute('virtual')
export class Virtual {

  @bindable()
  gridState: IGridState;

  virtualState: IVirtualState;

  constructor(
    @INode private el: Element
  ) {}


}
