import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { WordService } from './word.service';
import { GuessWordDto } from './dto/guess-word.dto';
import { WordRequestDto } from './dto/word-request.dto';
import { GetPossibleDto } from './dto/get-possible.dto';

@Controller('word')
export class WordController {
  constructor(private readonly wordService: WordService) {}

  @Get('/random')
  getRandom(@Query() wordRequest: WordRequestDto) {
    return this.wordService.getRandom(wordRequest);
  }

  @Post('/guess')
  guess(@Body() guessWord: GuessWordDto) {
    return this.wordService.guess(guessWord);
  }

  @Get('/cheat/:word')
  cheat(@Param() params: GetPossibleDto) {
    return this.wordService.getPossible(params);
  }
}
