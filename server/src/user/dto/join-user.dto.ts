import { User } from '../entities/user.entity';

export class JoinUserDto {
  username!: string;
  email?: string;
  nickname?: string;
  guesses: number = 0;
  constructor(user: User) {
    this.username = user.username;
    this.email = user.email;
    this.nickname = user.nickname;
    this.guesses = user.guesses;
  }
}
