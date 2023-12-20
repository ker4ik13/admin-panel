import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';

export type TokenDocument = HydratedDocument<Token>;

@Schema()
export class Token {
  @Prop({
    type: ObjectId,
    ref: 'User',
  })
  user: string;

  @Prop({
    required: true,
  })
  refreshToken: string;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
