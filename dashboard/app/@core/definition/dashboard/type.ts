export interface Card {
  type: 'grid' | 'table' | 'form' | 'status',
  class: string,
  title: string,
  body: any,
  settings?: any
}


