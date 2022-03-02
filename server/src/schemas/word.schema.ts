import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Word {
  @Prop({ required: true })
  word!: string;
}

export type WordDocument = Word & Document;

export const WordSchema = SchemaFactory.createForClass(Word);
