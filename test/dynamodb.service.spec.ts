import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
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
  let dynamodb: DynamoDB;

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
          useValue: DynamoDB,
        },
      ],
    }).compile();

    service = MODULE.get<DynamodbService>(DynamodbService);
    dynamodb = MODULE.get<DynamoDB>(DYNAMODB);
  });

  it('should return new item', async () => {
    dynamodb.putItem = jest.fn().mockResolvedValue(tableAItem);
    expect(
      await service.putItem({ name: 'test', surname: 'test' }, tableName),
    ).toBeTruthy();
  });

  it('should return get item', async () => {
    dynamodb.getItem = jest
      .fn()
      .mockResolvedValue({ Item: marshall(tableAItem) });
    expect(await service.getItemById({ id }, tableName)).toEqual(tableAItem);
  });
});
