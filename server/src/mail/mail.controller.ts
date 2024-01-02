import { Roles } from '@auth/decorators';
import { JwtAuthGuard, RolesGuard } from '@auth/guards';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserRoles } from 'src/types/UserRoles';
import { NewsletterDto } from './dto/newsletter.dto';
import { MailService } from './mail.service';

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
