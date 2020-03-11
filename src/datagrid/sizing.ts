import { inject } from '@aurelia/kernel';
import { bindable, customAttribute, customElement, BindingMode, INode } from '@aurelia/runtime';
import { IColumn, ISize } from './interfaces';

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
  }
}
