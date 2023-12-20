import {Capability} from "./open/type";
import {Post, PostTypeSetting, TaxonomySetting} from "./content/type";
import {Control} from "../../shared/control/type";
import {StyleConfig} from "@ckeditor/ckeditor5-style/src/styleconfig";
import {GeneralHtmlSupportConfig} from "@ckeditor/ckeditor5-html-support/src/generalhtmlsupportconfig";

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
  editor?: 'ckeditor';
  editorFeatures?: {
    isMarkdownSupport?: boolean;
    isHtmlSupport?: boolean;
    isHtmlEmbedSupport?: boolean;
    htmlRules?: GeneralHtmlSupportConfig;
    styleRules?: StyleConfig;
  };
  markdown?: boolean;
  taxonomies: Record<string, TaxonomySetting>;
  postTypes: Record<string, PostTypeSetting>;
  postMeta: Record<string, Meta[]>;
  termMeta: Record<string, Meta[]>;
  userMeta: Meta[];
  commentMeta: Meta[];
  assetsUrl: string;
  siteUrl: string;
  roles: {label: string, value: string}[];
  settingPages: {name: string, path: string}[];
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

export type SessionUser = ResponseBody & {
  isRichEditor: boolean,
  capabilities: Capability[],
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
  previewUrl?: string;
}


export type ServerEndpoint = {
  create: string;
  update: string;
  delete?: string;
  show?: string;
  list?: string;
}

export type Package = {
  packageName: string;
  name: string;
  description: string;
  version: string;
  miniOP: string;
  miniPHP: string;
  authors?: PackageAuthor[];
  homepage?: string;
  logo?: string;
  screenshot?: string;
  enabled: boolean;
  installed: boolean;
  upgradeable: boolean;
  actions:{name?:string, link:string, query?: Record<string, string>}[];
}

export type PackageAuthor = {
  name?: string;
  email?: string;
  homepage?: string;
}
