import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class ResponseBuilderService {
  async send(
    res: Response,
    endpoint: {
      statusCode: number;
      delay: number;
      responseBody: unknown;
    },
  ) {
    if (endpoint.delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, endpoint.delay));
    }

    return res.status(endpoint.statusCode).json(endpoint.responseBody);
  }
}
