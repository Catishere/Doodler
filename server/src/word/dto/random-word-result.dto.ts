export class RandomWordResultSuccessDto {
  ok: boolean = true;
  word: string;

  constructor(word: string) {
    this.word = word;
  }
}

export class RandomWordResultErrorDto {
  ok: boolean = false;
  error: string;

  constructor(error: string) {
    this.error = error;
  }
}

export type RandomWordResultDto =
  | RandomWordResultSuccessDto
  | RandomWordResultErrorDto;
