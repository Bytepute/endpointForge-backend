import { Module } from '@nestjs/common';
import { AccessService } from './access.service';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [DbModule],
  controllers: [],
  providers: [AccessService],
  exports: [AccessService],
})
export class AccessModule {}
