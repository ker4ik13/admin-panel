import { Injectable } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { Token } from './token.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { DeleteResult } from 'mongodb';

@Injectable()
export class TokenService {
  constructor(@InjectModel(Token.name) private model: Model<Token>) {}

  // Генерация JWT токенов
  async generateTokens(payload: string | object | Buffer) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_KEY, {
      expiresIn: '30m',
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_KEY, {
      expiresIn: '30d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  validateAccessToken(accessToken: string) {
    try {
      const userData = jwt.verify(accessToken, process.env.JWT_ACCESS_KEY);
      return userData;
    } catch (error) {
      return null;
    }
  }

  validateRefreshToken(refreshToken: string) {
    try {
      const userData = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);
      return userData;
    } catch (error) {
      return null;
    }
  }

  // Сохранения токенов в БД
  async saveToken(userId: string, refreshToken: string) {
    const tokenData = await this.model.findOne({ user: userId });

    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }

    // Сохранения JWT токена и ID пользователя в базе данных
    const token = await this.model.create({ user: userId, refreshToken });
    return token;
  }

  async removeToken(refreshToken: string): Promise<DeleteResult> {
    return await this.model.deleteOne({ refreshToken });
  }

  async findToken(refreshToken: string) {
    return await this.model.findOne({ refreshToken });
  }
}
