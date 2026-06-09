import { Module } from '@nestjs/common';
import { DbService } from './db.service';
import { DRIZZLE } from './db.decorator';

@Module({
  providers: [
    DbService,
    {
      provide: DRIZZLE,
      useFactory: (dbService: DbService) => dbService.db,
      inject: [DbService],
    },
  ],
  exports: [DRIZZLE],
})
export class DbModule {}
