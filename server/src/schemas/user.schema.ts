import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop({ required: true })
  username!: string;

  @Prop()
  email?: string;

  @Prop()
  nickname?: string;

  @Prop({ required: true, default: 0 })
  guesses!: number;
}
export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
