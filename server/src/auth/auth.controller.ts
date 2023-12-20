import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import CreateUserDto from 'src/user/dto/createUser.dto';
import { AuthService } from './auth.service';
import UserDto from 'src/user/dto/user.dto';
import { LoginUserDto } from 'src/user/dto/loginUser.dto';

@ApiTags('Авторизация')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Авторизация пользователя' })
  @ApiResponse({
    status: 201,
    type: LoginUserDto,
  })
  @Post('login')
  login(@Body() userDto: LoginUserDto) {
    return this.authService.login(userDto);
  }

  @ApiOperation({ summary: 'Регистрация пользователя' })
  @ApiResponse({ status: 201, type: UserDto })
  @UsePipes(new ValidationPipe())
  @Post('registration')
  registration(@Body() userDto: CreateUserDto) {
    return this.authService.registration(userDto);
  }
}
