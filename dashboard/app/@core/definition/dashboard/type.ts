import {ResponseBody} from "../common";

export type DASHBOARD_RESPONSE = ResponseBody & {status: Card, cards: Card[]}

export interface Card {
  type: 'table' | 'status' | 'bar-vertical' | 'pie-chart' | 'pie' | 'number' | 'bar-horizontal' | 'line' | 'area' | 'pie-grid',
  class: string,
  title: string,
  body: any,
  settings?: any
}


