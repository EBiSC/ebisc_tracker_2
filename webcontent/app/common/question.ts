export class Question {
  constructor(
    readonly description: string,
    readonly module: string,
    readonly title: string,
    readonly numFailed: number,
    readonly numTested: number
  ) { }
}

