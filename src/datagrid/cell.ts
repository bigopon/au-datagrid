import { customElement, bindable, IContainer } from "aurelia";
import {
  getRenderContext,
  IController,
  IHydratedController,
  LifecycleFlags,
  Controller,
  INode,
  MountStrategy,
  ISyntheticView,
  IViewFactory
} from '@aurelia/runtime';

const factoryMap = new WeakMap<IContainer, Map<string, IViewFactory>>();

@customElement({ name: 'cell' })
export class Cell {

  @bindable()
  html: string;

  private view: ISyntheticView;

  private isAttached: boolean;

  constructor(
    @IController readonly parentCtrler: IHydratedController,
    @IContainer readonly container: IContainer,
    @INode readonly element: Element,
  ) {}

  beforeBind(flags: LifecycleFlags) {
    this.htmlChanged(this.html, flags);
  }

  beforeAttach(flags: LifecycleFlags) {
    this.isAttached = true;
    this.view.attach(flags);
  }

  beforeDetach(flags: LifecycleFlags) {
    this.view.detach(flags);
  }

  beforeUnbind(flags: LifecycleFlags) {
    this.view.unbind(flags);
  }

  htmlChanged(html: string, flags = LifecycleFlags.none) {
    let view = this.view;
    if (view) {
      view.detach(flags);
      view.unbind(flags);
    }
    const viewFactory = this.getFactory(this.parentCtrler['context'], html);
    view = this.view = viewFactory.create(flags);
    view.hold(this.element, MountStrategy.append);
    view.bind(flags, this.parentCtrler.scope);
    if (this.isAttached) {
      view.attach(flags);
    }
  }

  getFactory(container: IContainer, html: string) {
    let map = factoryMap.get(container);
    if (!map) {
      factoryMap.set(container, map = new Map());
    }
    let factory = map.get(html);
    if (!factory) {
      map.set(
        html,
        factory = getRenderContext(
          { name: 'cell', template: html },
          container,
          void 0
          )
          .getViewFactory()
      );
    }
    return factory;
  }
}
