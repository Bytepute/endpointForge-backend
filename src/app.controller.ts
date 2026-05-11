import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Throttle } from '@nestjs/throttler';
import { generalThrottleLimit } from './constants/throttle-limit/general-throttle-limit';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Throttle({ default: generalThrottleLimit.get })
  getHello(): string {
    return this.appService.getHello();
  }
}
