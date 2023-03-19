import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { DynamoDB } from 'aws-sdk';
import { v4 as idV4 } from 'uuid';

import { TableAInterface } from '/opt/src/libs/interfaces/dynamodb/tablea.interface';
import { DynamodbService } from '/opt/src/libs/services/dynamodb.service';
import { DYNAMODB } from '/opt/src/libs/shared/injectables';

describe('DynamodbService', () => {
  const id = idV4();
  const tableName = 'test';
  const tableAItem: TableAInterface = {
    id,
    name: 'test',
    surname: 'test',
  };
  let service: DynamodbService;
  let dynamodb: DynamoDB.DocumentClient;

  beforeEach(async () => {
    global.console = require('console');
    const MODULE: TestingModule = await Test.createTestingModule({
      providers: [
        DynamodbService,
        {
          provide: ConfigService,
          useFactory: () => ({
            get: () => ({
              accountId: process.env.ACCOUNT_ID,
              stage: process.env.STAGE,
              region: process.env.REGION,
              tableA: process.env.TABLE_A,
            }),
          }),
        },
        {
          provide: DYNAMODB,
          useValue: DynamoDB.DocumentClient,
        },
      ],
    }).compile();

    service = MODULE.get<DynamodbService>(DynamodbService);
    dynamodb = MODULE.get<DynamoDB.DocumentClient>(DYNAMODB);
  });

  it('should return new item', async () => {
    dynamodb.put = jest.fn().mockImplementation(() => ({
      promise: jest.fn().mockResolvedValue(tableAItem),
    }));
    expect(
      await service.putItem({ name: 'test', surname: 'test' }, tableName),
    ).toBeTruthy();
  });

  it('should return get item', async () => {
    dynamodb.get = jest.fn().mockImplementation(() => ({
      promise: jest.fn().mockResolvedValue({ Item: tableAItem }),
    }));
    expect(await service.getItemById({ id }, tableName)).toEqual(tableAItem);
  });
});
