import { Body, Controller, Post } from '@nestjs/common';
import { JoinUserDto } from './dto/join-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/join')
  join(@Body() joinUserDto: JoinUserDto) {
    return this.userService.join(joinUserDto);
  }
}
