export class GuessWordSuccessDto {
  ok: boolean = true;
  data?: string[];
  additional?: string;

  constructor(data?: string[], additional?: string) {
    this.data = data;
    this.additional = additional;
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
