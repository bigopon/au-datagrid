import { bindable, customElement } from "aurelia";
import { IColumnDefinition, IGridState } from "./interfaces";

@customElement({
  name: 'sort-indicator',
  template:
    `<template :style='{ visibility: isVisible ? null : "hidden" }'>
      <img class="dg-sort-icon" src="/assets/svg-\${asc > 0 ? 'up' : 'down'}.svg">
      <span class="dg-sort-count" :style="{ visibility: state.sort.length <= 1 ? 'hidden' : null }">
    `
})
export class SortIndicator {

  @bindable()
  column: IColumnDefinition;

  @bindable()
  state: IGridState;

  get colIndex(): number {
    const sort = this.state.sort;
    const column = this.column;
    // We always render a sorting icon and number, even when the column is unsorted,
    // so that we can account for the icon width when auto-sizing the column.
    return sort.findIndex((x: any) => x.column === column);
  }

  get asc(): number {
    const i = this.colIndex + 1;
    const sort = this.state.sort;
    let asc = i === 0 ? 1 : sort[i - 1].asc;
    return asc;
  }

  get isVisible() {
    return this.colIndex !== -1;
  }
}
