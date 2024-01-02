import { JwtAuthGuard } from '@auth/jwt.auth.guard';
import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Телеграм бот')
@UseGuards(JwtAuthGuard)
@Controller('api/bot')
export class BotController {}
