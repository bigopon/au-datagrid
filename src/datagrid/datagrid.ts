import { bindable, customElement } from "aurelia";
import { GridState } from "./gridstate";
import { IColumnDefinition, IGridState } from "./interfaces";

export class DataGrid {

  state: IGridState;

  @bindable()
  data: any[];

  @bindable()
  columns: IColumnDefinition[];

  @bindable()
  selected: any[] | Set<any>;

  beforeBind() {
    window['grid'] = this;
    this.ensureProps();
    this.state = new GridState(this.columns, this.selected);
    this.dataChanged(this.data);
  }

  dataChanged(data: any[]): void {
    this.state.data = data;
  }

  // todo: maybe have a way to do validation with @customElement decorator?
  private ensureProps() {
    if (!this.columns) {
      throw new Error(`Column definition missing: ', columns: ${typeof this.columns} `);
    }
  }
}
