import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { SESEventDto } from './dtos/SESEvent.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async snsEvent(@Body() event: SESEventDto) {
    return this.appService.convert(event);
  }
}
