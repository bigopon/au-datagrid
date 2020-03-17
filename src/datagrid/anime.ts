import { INode, customAttribute, bindable } from "aurelia";

@customAttribute('anim-column')
export class AnimColumn {

  @bindable()
  animate: (el: HTMLTableCellElement) => Animation;

  constructor(@INode readonly el: HTMLTableCellElement) {}

  animateChanged(value, oldValue) {
    if (value && value !== oldValue && oldValue != null) {
      value(this.el);
    }
  }
}
