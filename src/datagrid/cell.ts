import { customElement, bindable, IContainer } from "aurelia";
import {
  getRenderContext,
  IController,
  IHydratedController,
  LifecycleFlags,
  Controller,
  INode,
  MountStrategy
} from '@aurelia/runtime';

@customElement({
  name: 'cell',
  template: '<template></template>'
})
export class Cell {

  @bindable()
  html: string;

  private view: Controller;

  constructor(
    @IController readonly parentCtrler: IHydratedController,
    @IContainer readonly container: IContainer,
    @INode readonly element: Element,
  ) {}

  beforeBind() {
    this.htmlChanged(this.html, LifecycleFlags.fromBind);
  }

  beforeDetach() {
    this.view.detach(LifecycleFlags.none);
  }

  beforeUnbind() {
    this.view.unbind(LifecycleFlags.none);
  }

  htmlChanged(html: string, flags = LifecycleFlags.none) {
    const viewFactory = getRenderContext(
        { name: 'cell', template: html },
        this.container,
        void 0
      )
      .getViewFactory();

    let view = this.view;
    if (view) {
      view.detach(flags);
      view.unbind(flags);
    }
    view = this.view = viewFactory.create(flags) as unknown as Controller;
    (view as Controller).hold(this.element, MountStrategy.append);
    view.bind(flags, this.parentCtrler.scope);
    view.attach(flags);
  }
}
