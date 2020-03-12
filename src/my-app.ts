import { IColumnDefinition } from './datagrid/interfaces';

export class MyApp {
  public message = 'Hello World!';

  state = {
    columns: [
      { label: 'Id', data: 'id' },
      { label: 'Name', data: 'name' },
      { label: 'Height', data: 'height', css: 'dg-right', sortable: false, width: 100 },
      { label: 'Weight', data: 'weight', css: 'dg-right', sortable: false, width: 100 },
      { label: 'Spawn chance', data: 'spawn_chance', right: true, width: 100 },
    ] as IColumnDefinition[],
    data: [] as any[] | Promise<any[]>,

    selected: []
  };

  async fetch() {
    this.state.data = await new Promise(resolve => setTimeout(resolve, 15))
      .then(() => import(/* webpackChunkName: "pokedex" */ './pokedex'))
      .then(({ default: data }) => data.slice(0));
  }

  beforeBind() {
    this.fetch();
  }
}
