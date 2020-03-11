import { IGridState, ISize, IColumn, IColumnDefinition, ISortColumn } from "./interfaces";
import { IVirtualState } from "./virtual";

export class GridState implements IGridState {

  data: any[];
  size: ISize;
  sort: ISortColumn[];
  columns: IColumn[];
  selected: Set<any> | any[];

  private _items: any[];
  private _virtual: IVirtualState;

  get items(): any[] {
    const data = this.data;
    const sort = this.sort;
    if (sort.length === 0) {
      return data;
    }

    const comparer = (a: object, b: object) =>  {
      for (let s of sort) {
        let d = s.column.data!;
        let da = a[d], db = b[d];
        if (da > db) return s.asc;
        if (da < db) return -s.asc;
      }
      return 0;
    };
    return [...data].sort(comparer);
  }

  get fillerSize(): number {
    const size = this.size;
    if (!size) {
      return 0;
    }
    const columns = this.columns;
    const total = columns.reduce((sum, col) => col.name === 'filler' || isNaN(col.width) ? sum : sum + col.width, 0);
    return size.width - total;
  }

  constructor(
    columns: IColumnDefinition[],
    selected: Set<any> | any[]
  ) {
    this.columns = [
      ...columns.map(c => ({
        header: '${c.label}',
        render: '${item[c.data]}',
        ...c
      })),
      {
        name: 'filler',
        header: null,
        render: null,
        resizable: false,
        sortable: false,
        // @ts-ignore
        // hack, basically to give a link to observation
        // todo: solve this
        state: this,
        get width(): number {
          return this.state.fillerSize;
        }
      }
    ];
    this.selected = selected;
    if (selected) {
      this.columns.unshift({
        header: '<input type="checkbox" @click="$event.stopPropagation() || true" />',
        render: '<input type="checkbox" checked.bind="state.selected" :model="item" />',
        sortable: false,
        resizable: false
      });
    }
    this.sort = [];
  }

  useVirtual(virtualState: IVirtualState) {
    this._virtual = virtualState;
    virtualState.data = this.data;
    virtualState.size = this.size;
  }

  sortOn(column: IColumnDefinition, multi?: boolean): void {
    if (column.sortable === false) {
      return;
    }
    const sort = this.sort;

    const i = sort.findIndex(x => x.column === column);        
    let asc = i >= 0 ? sort[i].asc : 0;
    if (!multi) {
      sort.length = 0;
    } else if (asc !== 0) {
      sort.splice(i, 1);
    }
    asc = asc === 0
      ? 1
      : asc > 0
        ? -1
        : 0;

    if (asc !== 0) {
      sort.push({ column, asc });
    }
  }
}
