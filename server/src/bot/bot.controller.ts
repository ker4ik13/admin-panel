import { JwtAuthGuard } from '@auth/guards';
import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Телеграм бот')
@UseGuards(JwtAuthGuard)
@Controller('bot')
export class BotController {}
