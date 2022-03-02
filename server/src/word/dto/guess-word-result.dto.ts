export class GuessWordSuccessDto {
  data: string[] = [];
}

export class GuessWordErrorDto {
  error?: string;
}

export type GuessWordResultDto = GuessWordErrorDto | GuessWordSuccessDto;
