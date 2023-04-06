import {Params} from "@angular/router";

export interface Capability {
  name: string;
  route: string;
  path: string;
  children?: Capability[];
  icon?: string;
  hidden?: boolean;
  sort?: number;
  link?: string;
  home?: boolean;
  queryParams?: Params;
}
