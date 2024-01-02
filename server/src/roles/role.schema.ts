import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type RoleDocument = HydratedDocument<Role>;

@Schema({
  collection: 'roles',
})
export class Role {
  @ApiProperty({
    example: 'ADMIN',
    description: 'Название роли',
  })
  @Prop({
    required: true,
  })
  value: string;

  @ApiProperty({
    example: 'Администратор',
    description: 'Описание/название роли',
  })
  @Prop({
    required: true,
  })
  label: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
