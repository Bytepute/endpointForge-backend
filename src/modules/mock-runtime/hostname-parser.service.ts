import { Injectable } from '@nestjs/common';

@Injectable()
export class HostnameParserService {
  parse(hostname: string): {
    username: string | null;
  } {
    const parts = hostname.split('.');

    /**
     * localhost
     * domain.ir
     */
    if (parts.length < 3) {
      return {
        username: null,
      };
    }

    return {
      username: parts[0],
    };
  }
}
