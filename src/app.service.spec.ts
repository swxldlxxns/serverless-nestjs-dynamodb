import { Test, TestingModule } from '@nestjs/testing';
import { v4 as idV4 } from 'uuid';

import { AppService } from '/opt/src/app.service';
import { TableAInterface } from '/opt/src/libs/interfaces/dynamodb/tablea.interface';
import { CreateRequestsDto } from '/opt/src/libs/interfaces/request/create-requests.dto';
import { DynamodbService } from '/opt/src/libs/services/dynamodb.service';
import { errorResponse, formatResponse } from '/opt/src/libs/utils';

const SERVICE_NAME = 'AppService';

describe('AppService', () => {
  const id = idV4();
  const tableAItem: TableAInterface = {
    id,
    name: 'test',
    surname: 'test',
  };
  const createDto: CreateRequestsDto = { name: 'test', surname: 'test' };
  let service: AppService;
  let dynamoService: DynamodbService;

  beforeEach(async () => {
    global.console = require('console');
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService, DynamodbService],
    }).compile();
    service = module.get<AppService>(AppService);
    dynamoService = module.get<DynamodbService>(DynamodbService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('should return new user', async () => {
    jest
      .spyOn(dynamoService, 'putItem')
      .mockImplementation(async (): Promise<boolean> => Promise.resolve(true));
    jest
      .spyOn(dynamoService, 'getItemById')
      .mockImplementation(
        async (): Promise<TableAInterface> => Promise.resolve(tableAItem),
      );
    expect(await service.create(createDto)).toEqual(
      formatResponse(tableAItem, SERVICE_NAME),
    );
  });

  it('should return error', async () => {
    jest
      .spyOn(dynamoService, 'putItem')
      .mockRejectedValue(new Error('Test Error'));
    expect(await service.create(createDto)).toEqual(
      errorResponse(
        {
          message: 'Test Error',
        },
        SERVICE_NAME,
      ),
    );
  });
});
