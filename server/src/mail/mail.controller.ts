import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { NewsletterDto } from './dto/newsletter.dto';
import { MailService } from './mail.service';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.auth.decorator';
import { UserRoles } from 'src/types/UserRoles';

@UseGuards(JwtAuthGuard)
@Controller('api')
export class MailController {
  constructor(readonly mailService: MailService) {}

  @Roles(UserRoles.Creator, UserRoles.Admin)
  @UseGuards(RolesGuard)
  @Post('newsletter')
  newsletter(@Body() dto: NewsletterDto) {
    return this.mailService.newsletter(dto);
  }
}
