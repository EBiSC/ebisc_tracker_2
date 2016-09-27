import { Question } from './question';

export class Exam {
  constructor(
    readonly date: string,
    readonly failedModules: string[],
    readonly questions: Question[]
  ) { }
}
