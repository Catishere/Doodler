export class RandomWordResultSuccessDto {
  word!: string;
}

export class RandomWordResultErrorDto {
  error?: string;
}

export type RandomWordResultDto =
  | RandomWordResultSuccessDto
  | RandomWordResultErrorDto;
