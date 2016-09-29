import { LineFail } from './line-fail';

export class LineFailList {
  constructor(
    readonly items: LineFail[],
    readonly pageLimit: number,
    readonly pageOffset: number,
    readonly total: number
  ) { }
}
