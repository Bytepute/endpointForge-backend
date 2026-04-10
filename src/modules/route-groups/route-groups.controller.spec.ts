import { Test, TestingModule } from '@nestjs/testing';
import { RouteGroupsController } from './route-groups.controller';

describe('RouteGroupsController', () => {
  let controller: RouteGroupsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RouteGroupsController],
    }).compile();

    controller = module.get<RouteGroupsController>(RouteGroupsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
