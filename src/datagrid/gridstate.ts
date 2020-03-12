import { IGridState, ISize, IColumn, IColumnDefinition, ISortColumn, IVirtualState } from "./interfaces";
import { VirtualState } from "./virtual";

let getterCallCount = 0;
let __id = 0;
const get = () => {
  getterCallCount++;
  clearTimeout(__id);
  __id = window.setTimeout(() => console.log(getterCallCount), 1000);
}

export class GridState implements IGridState {

  data: any[];
  size: ISize;
  sort: ISortColumn[];
  columns: IColumn[];
  selected: any[];
  search: string;
  virtual: IVirtualState;

  get items(): any[] {
    let data = this.data;
    if (!data || data.length === 0) {
      return data;
    }
    const search = this.search;
    if (search) {
      const columns = this.columns;
      if (columns.length > 0) {
        const re = RegExp(escapeRegExp(search), 'i');
        const searchables = columns.filter(c => c.searchable !== false).map(c => c.data!);
        data = data.filter(obj => {
          for (const s of searchables) {
            const val = obj[s];
            if (val != null && re.test(val + ""))
              return true;
          }
          return false;
        });
      }
    }

    const sort = this.sort;
    if (sort.length > 0) {
      const comparer = (a: object, b: object) =>  {
        for (let s of sort) {
          let d = s.column.data!;
          let da = a[d], db = b[d];
          if (da > db) return s.asc;
          if (da < db) return -s.asc;
        }
        return 0;
      };
      data = [...data].sort(comparer);
    }

    if (this.virtual) {
      // this return is awkward, todo: fix
      data = this.virtual.calc(data);
    }
    get();
    return data;
  }

  get fillerSize(): number {
    const size = this.size;
    if (!size) {
      return 0;
    }
    const columns = this.columns;
    const total = columns.reduce((sum, col) => col.name === 'filler' || isNaN(col.width) ? sum : sum + col.width, 0);
    return Math.max(0, size.width - total);
  }

  constructor(
    columns: IColumnDefinition[],
    selected: any[]
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

  useVirtual() {
    if (!this.virtual) {
      this.virtual = new VirtualState(this);
    }
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
  
  select(item: any) {
    const selected = this.selected;
    // todo: maybe support single select here
    if (!selected) {
      return;
    }
    const idx = selected.indexOf(item);
    if (idx === -1) {
      selected.push(item);
    } else {
      selected.splice(idx, 1);
    }
  }
}

function escapeRegExp(re: string) {
  return re.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
