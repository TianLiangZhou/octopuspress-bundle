import {User} from "../user/type";
import {ResponseBody} from "../common";

type Author = Pick<User, "id" | "nickname">;

export type Attachment = {
  id: number,
  url: string,
}

export type PostStatus = 'draft' | 'publish' | 'future' | 'private' | 'pending';



export interface Post {
  id: number,
  parent: Post | null,
  author: Author | null,
  title: string,
  name: string,
  excerpt: string,
  content: string,
  status: PostStatus,
  type: string,
  commentStatus: 'open' | 'closed',
  pingStatus: 'open' | 'closed',
  relationships: TermTaxonomy[],
  password: string | null,
  date: string | null,
  meta: Record<string, any>,
  featuredImage: Partial<Attachment>,
  createdAt?: string,
  modifiedAt?: string,
  previewUrl?: string,
}




export interface TermTaxonomy {
  id: number|null;
  name: string;
  slug: string;
  parent?: number|null;
  taxonomy: string;
  count?: number,
  description?: string;
  level?: number,
  meta?: Record<string, any>
}

export interface PostTypeSetting {
  label: string,
  labels: Record<string, any>;
  supports: string[],
  parentType: string[],
  children: string[],
  visibility: {
    showUi: boolean;
    showNavigation: boolean;
  };
}

export interface TaxonomySetting {
  slug: string;
  label: string;
  labels: Record<string, any>;
  types: string[];
  hierarchical: boolean;
  visibility: {
    showUi: boolean;
    showPostFilter: Record<string, boolean>;
    showPostTable: Record<string, boolean>;
    showNavigation: boolean;
  }
}

