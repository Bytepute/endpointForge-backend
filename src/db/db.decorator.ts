import { Inject } from '@nestjs/common';

export const DRIZZLE = 'DRIZZLE_CONNECTION';

export const InjectDrizzle = () => Inject(DRIZZLE);
