import {Menu} from "./open/type";
import {Post, PostTypeSetting, TaxonomySetting} from "./content/type";
import {Control} from "../../shared/control/type";

export interface Meta {
  key: string;
  showUi: boolean;
  isCreated: boolean;
  isUpdated: boolean;
  control: Control;
}

export interface AppConfiguration {
  timestamp: number;
  name: string;
  logo: string;
  editor?: string;
  taxonomies: Record<string, TaxonomySetting>;
  postTypes: Record<string, PostTypeSetting>;
  postMeta: Record<string, Meta[]>;
  termMeta: Record<string, Meta[]>;
  userMeta: Meta[];
  commentMeta: Meta[];
  assetsUrl: string;
  siteUrl: string;
  roles: {label: string, value: string}[];
}

export declare interface OnSpinner {
  onSpinner(spinner: boolean): void
}

export interface ResponseBody {
  message?: string | string[],
}

export type Records<T> = ResponseBody & {
  total: number,
  records: T[],
};

export type Menus = ResponseBody & {
  menus: Menu[],
}

export type SiteOption = ResponseBody & {
  timezone: string[];
  option: Record<string, any>
}
export type SiteAdOption = Omit<SiteOption, "timezone">;

export type SiteContentOption = Omit<SiteOption, "timezone">;

export type PostEntity = ResponseBody & Post;

export type ActionBody = ResponseBody & {
  id: number;
}


export type ServerEndpoint = {
  create: string;
  update: string;
  delete?: string;
  show?: string;
  list?: string;
}
