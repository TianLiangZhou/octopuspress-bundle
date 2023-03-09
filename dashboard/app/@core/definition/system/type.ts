export interface Option {
  id: number;
  name: string;
  value: any | any[];
  type: number;
}

export interface Role {
  id: number;
  name: string;
  capabilities: string[];
}
