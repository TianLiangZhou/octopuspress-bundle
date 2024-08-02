import {ResponseBody} from "../common";
import {Post, TermTaxonomy} from "../content/type";
import {Control} from "../../../shared/control/type";

export type NavigateStructure = ResponseBody & {
  articles: Post[],
  pages: Post[],
  categories: TermTaxonomy[],
  navigate: TermTaxonomy[],
}

export type CustomizeResponse = ResponseBody & {
  sections: Section[],
  theme: {
    stylesheet: string,
  }
}

export type Section = {
  id: string;
  label: string;
  description: string;
  controls: Control[];
}

export interface WidgetData {
  id: string;
  name: string;
  attributes:Record<string, any>;
  children: WidgetData[];
}

export interface Block {
  name: string;
  label: string;
  widgets: WidgetData[]
}

export interface Widget {
  name: string;
  label: string;
  category: string;
  icon: string;
  description: string;
  keywords: string[];
  sections: Section[];
  supports: Record<string, any>;
  styles: string[];
}

export interface WidgetCategory {
  slug: string;
  label: string;
  icon: string;
  widgets?: Widget[],
}
export interface RegisteredResponse {
  widgets: Widget[],
  categories: WidgetCategory[],
}

export interface RenderedResponse {
  output: string;
}
