import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { WordModule } from './word/word.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    WordModule,
    UserModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI)
  ]
})
export class AppModule {}
