import { Test, TestingModule } from '@nestjs/testing';
import { RouteGroupsService } from './route-groups.service';

describe('RouteGroupsService', () => {
  let service: RouteGroupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RouteGroupsService],
    }).compile();

    service = module.get<RouteGroupsService>(RouteGroupsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
