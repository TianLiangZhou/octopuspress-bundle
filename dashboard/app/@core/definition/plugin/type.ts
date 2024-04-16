import {ResponseBody} from "../common";
import {Control} from "../../../shared/control/type";
import {IColumns} from "angular2-smart-table/lib/lib/settings";


export type PluginDrawResponse = ResponseBody & {
  title: string;
  container: 'tabs' | 'form' | 'table';
  tabs?: DrawTab[];
  form?: DrawForm;
  table?: DrawTable;
}

export type DrawTab = {
  title: string;
  icon?: string;
  container: 'form' | 'table';
  form?: DrawForm;
  table?: DrawTable;
}

export type DrawForm = {
  controls: Control[],
  direction: 'column' | 'row',
  submit: {
    name: string,
    link: string,
    valid: boolean,
  }
  reset?: {
    name: string,
  },
  class: string,
}

export type DrawTable = {
  columns: IColumns;
  source: {default: string, add: string, delete: string, edit: string};
  actions: {add: boolean, edit: boolean, delete: boolean},
}
