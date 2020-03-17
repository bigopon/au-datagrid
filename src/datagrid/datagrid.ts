import { bindable, customElement } from "aurelia";
import { GridState } from "./gridstate";
import { IColumnDefinition, IGridState, IColumn, ISize } from "./interfaces";
import './interfaces';
import { moveX } from "./animations";

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

  set size(size: ISize) {
    this.state.size = size;
    this.updateAnimate();
  }

  beforeBind() {
    window['grid'] = this;
    this.ensureProps();
    this.state = new GridState(this.columns, this.selected);
    if (this.virtual) {
      this.state.useVirtual();
    }
    this.updateAnimate();
    this.dataChanged(this.data);
  }

  dataChanged(data: any[]): void {
    this.state.data = data;
    this.updateAnimate();
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

  headerClicked(e: MouseEvent, c: IColumnDefinition) {
    this.state.sortOn(c, e.ctrlKey);
    return true;
  }

  headerPointerDown({ currentTarget: th, x, pointerId }: PointerEvent & { currentTarget: HTMLElement }, column: IColumn) {
    const state = this.state;
    const columns = state.columns;
    let i = columns.indexOf(column);

    function thresholds() {
      return [
        i > 0 ? -columns[i - 1].width / 2 : -Infinity,
        i < columns.length - 1 ? columns[i + 1].width / 2 : Infinity,
      ];
    }

    let [left, right] = thresholds();
    let translateX: CSSUnitValue;
    let transform: CSSTransformValue;

    const preventClick = (e: Event) => e.stopImmediatePropagation();

    const moveHandler = (event: PointerEvent) => {
      let delta = event.x - x;
      
      // start dragging after a significant amount of movement
      if (!column.dragged) {
        if (Math.abs(delta) < 4) return;
        column.dragged = true;
        window.addEventListener('click', preventClick, { once: true, capture: true })
        transform = new CSSTransformValue([ new CSSTranslate(translateX = CSS.px(0), CSS.px(0)) ]);        
      }

      // swap columns if required
      if (delta < left) {
        const other = columns[--i];
        x -= other.width;
        columns.splice(i, 2, column, other);
        this.updateAnimate();
        delta = event.x - x;
        [left, right] = thresholds();
      }
      else if (delta > right) {
        const other = columns[++i];
        x += other.width;
        columns.splice(i - 1, 2, other, column);
        this.updateAnimate();
        delta = event.x - x;
        [left, right] = thresholds();
      }

      translateX.value = delta;
      th.attributeStyleMap.set('transform', transform);
    };

    window.addEventListener('pointermove', moveHandler, true);

    window.addEventListener('pointerup', () => {
      window.removeEventListener('pointermove', moveHandler, true);
      if (!column.dragged) return;
      column.dragged = false;
      th.attributeStyleMap.delete('transform');
      setTimeout(() => window.removeEventListener('click', preventClick, true), 0);
    }, { 
      once: true, 
      capture: true 
    });
    return true;
  }

  private updateAnimate() {
    let offset = 0;
    for (let c of this.state.columns) {
      let old = c.offsetX;
      c.offsetX = offset;
      offset += c.width;

      // create animation if column moved
      if (old !== undefined) {
        let delta = old - c.offsetX;
        if (Math.abs(delta) > 3) {
          const anim = c.animationX;
          if (anim?.playState === 'running') {
            const progress = anim.effect!.getComputedTiming().progress!;
            delta += (1 - progress) * c.deltaX!;
          }

          const effect = moveX(delta);
          c.deltaX = delta;
          c.animate = el => c.animationX = el.animate(...effect);
        }
      }
    }
  }

  // todo: maybe have a way to do validation with @customElement decorator?
  private ensureProps() {
    if (!this.columns) {
      throw new Error(`Column definition missing: ', columns: ${typeof this.columns} `);
    }
  }
}
