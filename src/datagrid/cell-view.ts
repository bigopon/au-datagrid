import {
  IViewLocator,
  valueConverter,
  view
} from '@aurelia/runtime';
import { IColumn } from './interfaces';

const object2ModelMap = new WeakMap<any, Record<string, CellModel>>();
const dataCellViewName = 'data-cell';
const headerCellViewName = 'header-cell';

@valueConverter('cellView')
export class DataCellView {
  public constructor(
    @IViewLocator private readonly viewLocator: IViewLocator,
  ) {}

  public toView(object: any, column: IColumn, dataIndex?: string) {
    let viewMap = object2ModelMap.get(object);
    if (viewMap == null) {
      object2ModelMap.set(object, viewMap = {});
    }

    let cellModel: CellModel;
    dataIndex = dataIndex || column.data;
    cellModel = viewMap[dataIndex];
    if (cellModel == null) {
      cellModel = viewMap[dataIndex] = new CellModel(object, column);
    }

    return this.viewLocator.getViewComponentForObject(
      cellModel,
      dataIndex === 'header' ? headerCellViewName : dataCellViewName
    );
  }
}

// item, c in template from corresponding property
@view({ name: 'data-cell', template: '${item[c.data]}' })
@view({ name: 'header-cell', template: '${c.label}' })
class CellModel {
  constructor(
    public readonly item: any,
    public readonly c: IColumn
  ) {}
}
