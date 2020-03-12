import { bindable, customElement } from "aurelia";
import { GridState } from "./gridstate";
import { IColumnDefinition, IGridState } from "./interfaces";
import './interfaces';

export class DataGrid {

  state: IGridState;

  @bindable()
  data: any[];

  @bindable()
  columns: IColumnDefinition[];

  @bindable()
  selected: any[];

  @bindable()
  search: string;

  @bindable({ set: v => v || v === '' ? true : false })
  virtual: boolean = false;

  beforeBind() {
    window['grid'] = this;
    this.ensureProps();
    this.state = new GridState(this.columns, this.selected);
    if (this.virtual) {
      this.state.useVirtual();
    }
    this.dataChanged(this.data);
  }

  dataChanged(data: any[]): void {
    this.state.data = data;
  }

  searchChanged(search: string) {
    this.state.search = search;
  }

  clicked(row: HTMLTableRowElement & { item: any } | null) {
    if (!row) {
      return;
    }
    this.state.select(row.item);
  }

  // todo: maybe have a way to do validation with @customElement decorator?
  private ensureProps() {
    if (!this.columns) {
      throw new Error(`Column definition missing: ', columns: ${typeof this.columns} `);
    }
  }
}
