import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../schemas/user.schema';
import { WordSchema } from '../schemas/word.schema';
import { WordController } from './word.controller';
import { WordService } from './word.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Word', schema: WordSchema },
      { name: 'User', schema: UserSchema }
    ])
  ],
  controllers: [WordController],
  providers: [WordService]
})
export class WordModule {}
