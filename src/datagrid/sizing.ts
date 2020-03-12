import { bindable, BindingMode, customAttribute, customElement, INode } from '@aurelia/runtime';
import { IColumn, IGridState, ISize } from './interfaces';

@customAttribute('size')
export class SizeAttr {

  @bindable({ mode: BindingMode.fromView })
  size: ISize;

  private observer: ResizeObserver;

  constructor(@INode private el: Element) {}

  beforeBind() {
    this.observer = new ResizeObserver(records => {
      const newSize = records[0].contentRect;
      this.size = {
        width: newSize.width,
        height: newSize.height
      };
    });

    this.observer.observe(this.el, { box: 'border-box' });
  }

  beforeUnbind() {
    this.observer.disconnect();
  }
}

@customAttribute('autosize')
export class AutoSize {

  @bindable()
  state: IGridState;

  constructor(@INode readonly el: HTMLTableRowElement) {}

  afterAttach() {
    const el = this.el;
    const columns = this.state.columns;
    const headerCells = el.cells;
    for (let i = 0, ii = headerCells.length; ii > i; ++i) {
      const column = columns[i];
      if (column.name !== 'filler') {
        columns[i].width = headerCells[i].clientWidth;
      }
    }

    // Once autosizing is done, put the grid in fixed-layout mode
    el.closest('table').style.width = "100%";
  }
}

@customElement({
  name: 'col-resizer',
  template:
  `<template
    :class="col.resizable === false ? 'dg-separator' : 'dg-resizer'"
    @click="$event.stopImmediatePropagation()"
    @pointerdown="onPointerDown($event)">`
})
export class ColResizer {
  @bindable()
  column: IColumn;

  onPointerDown(event: PointerEvent & { target: HTMLElement }) {
    const { target, x, pointerId } = event;
    const column = this.column;
    const baseWidth = column.width;
    const moveHandler = (event: PointerEvent) =>
      column.width = Math.max(baseWidth + event.x - x, 40);

    target.setPointerCapture(pointerId);
    target.addEventListener('pointermove', moveHandler);
    target.addEventListener(
      'pointerup',
      () => {
        target.removeEventListener('pointermove', moveHandler);
        target.releasePointerCapture(pointerId);
      },
      { once: true }
    );
    return true;
  }
}
