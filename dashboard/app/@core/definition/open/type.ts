export interface Menu {
  name: string;
  slug: string;
  path: string;
  children?: Menu[];
  icon?: string;
  hidden?: boolean;
  sort?: number;
  link?: string;
  home?: boolean;
}
