import { Fail } from './fail';

export class FailList {
  constructor(
    readonly items: Fail[],
    readonly pageLimit: number,
    readonly pageOffset: number,
    readonly total: number
  ) { }
}
