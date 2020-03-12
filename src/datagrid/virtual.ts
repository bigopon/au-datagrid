import { ISize, IGridState } from "./interfaces";
import { IVirtualState, IConfigurableVirtualState } from './interfaces';

export class VirtualState implements IVirtualState {

  scrollTop = 0;
  rowHeight = 25;
  buffer = 4;
  topGap = 0;
  bottomGap = 0;
  index = 0;
  count = 0;

  constructor(readonly gridState: IGridState) {}

  setState(newState: Partial<IConfigurableVirtualState>): void {
    Object.assign(this, newState);
  }

  calc(data: any[]): any[] {
    let { size } = this.gridState;
    // no data, reset
    if (!data || !size || !data.length) {
      return data;
    }
    let {
      buffer,
      rowHeight,
      scrollTop,
    } = this;
    // Technically, size.height is slighty too high because it's the height of the full table, 
    // including thead, rather than just tbody.
    // That's not an issue though, it just means one or two extra rows will be rendered past the bottom.
    const length = data.length;
    const index = this.index = Math.max((scrollTop / rowHeight | 0) - buffer, 0);
    const count = this.count = Math.min((size.height / rowHeight | 0) + 1 + buffer + buffer, length - index);
    this.topGap = index * rowHeight;
    this.bottomGap = (length - count - index) * rowHeight;
    return data.slice(index, index + count);
  }
}
