export class QuestionTimeline {
  constructor(
    readonly items: {
      readonly date: string,
      readonly numFailed: number,
      readonly numTested: number,
    }[],
    readonly pageLimit: number,
    readonly pageOffset: number,
    readonly total: number
  ) { }
}
