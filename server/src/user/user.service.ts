import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { JoinUserDto } from './dto/join-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private UserModel: Model<UserDocument>) {}

  async join(joinUserDto: JoinUserDto): Promise<User> {
    const { username } = joinUserDto;
    const user = await this.UserModel.findOne({ username });
    if (user === null) {
      joinUserDto.username = 'User' + Math.floor(Math.random() * 1000000);
      const createdUser = new this.UserModel(joinUserDto);
      return await createdUser.save();
    }
    return user;
  }
}
