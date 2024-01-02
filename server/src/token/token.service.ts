import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { add } from 'date-fns';
import { Model } from 'mongoose';
import { v4 } from 'uuid';
import { Token } from './token.schema';

@Injectable()
export class TokenService {
  constructor(@InjectModel(Token.name) private model: Model<Token>) {}

  // Создание refresh токена
  async getRefreshToken(userId: string, agent: string): Promise<Token> {
    const _token = await this.model.findOne({
      userId,
      userAgent: agent,
    });

    const token = _token?.token ?? null;

    // Находим токен пользователя. Если он есть - возвращается измененный
    if (token) {
      return await this.model.findOneAndUpdate(
        {
          token: token,
        },
        {
          token: v4(),
          exp: add(new Date(), { months: 1 }),
        },
        {
          upsert: true,
        },
      );
    }

    // Если нет - создается новый
    return this.model.create({
      token: v4(),
      exp: add(new Date(), { months: 1 }),
      userId,
      userAgent: agent,
    });
  }

  // Найти токен
  async findToken(refreshToken: string): Promise<Token> {
    return await this.model.findOne({ token: refreshToken });
  }

  // Удалить токен
  async deleteToken(refreshToken: string): Promise<Token> {
    return await this.model.findOneAndDelete({ token: refreshToken });
  }
}