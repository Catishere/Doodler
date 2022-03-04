export class GuessWordSuccessDto {
  ok: boolean = true;
  data?: string[];

  constructor(data?: string[]) {
    this.data = data;
  }
}

export class GuessWordErrorDto {
  ok: boolean = false;
  error?: string;
  info?: string;

  constructor(error: string, info?: string) {
    this.error = error;
    this.info = info;
  }
}

export type GuessWordResultDto = GuessWordErrorDto | GuessWordSuccessDto;
