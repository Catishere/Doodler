import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Word, WordDocument } from '../schemas/word.schema';
import { UserDocument } from '../schemas/user.schema';
import { cryptoUtils } from '../util/crypto.utils';
import { GuessWordDto } from './dto/guess-word.dto';
import {
  GuessWordErrorDto,
  GuessWordResultDto,
  GuessWordSuccessDto
} from './dto/guess-word-result.dto';
import { WordRequestDto } from './dto/word-request.dto';
import {
  RandomWordResultDto,
  RandomWordResultErrorDto,
  RandomWordResultSuccessDto
} from './dto/random-word-result.dto';

@Injectable()
export class WordService {
  constructor(
    @InjectModel('Word') private WordModel: Model<WordDocument>,
    @InjectModel('User') private UserModel: Model<UserDocument>
  ) {}

  async guess(guessDto: GuessWordDto): Promise<GuessWordResultDto> {
    const { word, guess, _id } = guessDto;
    const user = await this.UserModel.findById(_id);
    const wordExists = await this.WordModel.findOne({ word: guess });

    if (user === null) {
      return new GuessWordErrorDto('Ти не си човек');
    }

    if (wordExists === null) {
      return new GuessWordErrorDto('Няма такава дума');
    }

    if (user.guesses < 6) user.guesses++;
    await user.save();

    if (user.guesses > 6) {
      return new GuessWordErrorDto('Ти използва всичките си опити');
    }

    let decrypted: string;
    try {
      decrypted = cryptoUtils.decrypt(word);
    } catch (e) {
      const random = await this.getRandom({ _id });
      if (!random.ok) {
        return new GuessWordErrorDto(
          (random as RandomWordResultErrorDto).error
        );
      }
      return new GuessWordErrorDto(
        'EXPIRED',
        (random as RandomWordResultSuccessDto).word
      );
    }

    const decryptArray = decrypted.split('');
    const resultArray = [...Array(5)];
    const guessArray = guess.split('');

    guessArray.forEach((ch, i) => {
      if (decrypted[i] === ch) {
        decryptArray.splice(i, 1, ' ');
        resultArray[i] = 'correct';
      }
    });

    guessArray.forEach((ch, i) => {
      if (resultArray[i] === 'correct') return;
      const index = decryptArray.indexOf(ch);
      if (index > -1) {
        decryptArray.splice(index, 1, ' ');
        resultArray[i] = 'present';
      } else {
        resultArray[i] = 'absent';
      }
    });

    if (user.guesses === 6)
      return new GuessWordSuccessDto(resultArray, decrypted);
    return new GuessWordSuccessDto(resultArray);
  }

  async getRandom(wordRequest: WordRequestDto): Promise<RandomWordResultDto> {
    const { _id } = wordRequest;
    if (!_id) return new RandomWordResultErrorDto('Ти не си човек');
    const user = await this.UserModel.findById(_id);
    if (user === null) {
      return new RandomWordResultErrorDto('Ти не си човек');
    }
    user.guesses = 0;
    user.save();
    const model = await this.WordModel.aggregate<Word>([
      { $sample: { size: 1 } }
    ]);
    console.log(`Word: ${model[0].word}`);
    const encryptedText = cryptoUtils.encrypt(model[0].word);
    return new RandomWordResultSuccessDto(encryptedText);
  }
}
