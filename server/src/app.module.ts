import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WordModule } from './word/word.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    WordModule,
    UserModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI)
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
