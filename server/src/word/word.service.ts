import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Word, WordDocument } from '../schemas/word.schema';
import { UserDocument } from '../schemas/user.schema';
import { cryptoUtils } from '../util/crypto.utils';
import { GuessWordDto } from './dto/guess-word.dto';
import {
  GuessWordResultDto,
  GuessWordSuccessDto
} from './dto/guess-word-result.dto';
import { WordRequestDto } from './dto/word-request.dto';

@Injectable()
export class WordService {
  constructor(
    @InjectModel('Word') private WordModel: Model<WordDocument>,
    @InjectModel('User') private UserModel: Model<UserDocument>
  ) {}

  async guess(guessDto: GuessWordDto): Promise<GuessWordResultDto> {
    const { word, guess, _id } = guessDto;
    const user = await this.UserModel.findById(_id);
    if (user === null) {
      return { error: 'User not found' };
    } else {
      if (user.guesses < 6) user.guesses++;
      await user.save();
    }

    if (user.guesses > 6) {
      return {
        error: `You have used all your guesses (${user.guesses} guesses used)`
      };
    }

    const decrypted = cryptoUtils.decrypt(word);
    const result: GuessWordResultDto = new GuessWordSuccessDto();
    for (let i = 0; i < guess.length; i++) {
      const ch = guess.charAt(i);
      if (decrypted[i] === ch) {
        result.data.push('correct');
      } else if (decrypted.includes(ch)) {
        result.data.push('present');
      } else {
        result.data.push('absent');
      }
    }
    return result;
  }

  async getRandom(wordRequest: WordRequestDto): Promise<Word> {
    const { _id } = wordRequest;
    const user = await this.UserModel.findById(_id);
    if (user === null) {
      throw new Error('User not found');
    } else {
      user.guesses = 0;
      user.save();
    }
    const model = await this.WordModel.aggregate<Word>([
      { $sample: { size: 1 } }
    ]);
    console.log(model[0].word);
    const encryptedText = cryptoUtils.encrypt(model[0].word);
    return { word: encryptedText };
  }
}
