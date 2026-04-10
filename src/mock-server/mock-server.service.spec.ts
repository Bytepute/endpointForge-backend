import { Test, TestingModule } from '@nestjs/testing';
import { MockServerService } from './mock-server.service';

describe('MockServerService', () => {
  let service: MockServerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MockServerService],
    }).compile();

    service = module.get<MockServerService>(MockServerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
