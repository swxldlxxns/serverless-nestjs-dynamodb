import { Test, TestingModule } from '@nestjs/testing';
import * as AWS from 'aws-sdk';
import { v4 as idV4 } from 'uuid';

import { TableAInterface } from '/opt/src/libs/interfaces/dynamodb/tablea.interface';
import { DynamodbService } from '/opt/src/libs/services/dynamodb.service';

describe('DynamodbService', () => {
  const dynamodb = Object.getPrototypeOf(new AWS.DynamoDB.DocumentClient());
  const id = idV4();
  const tableName = 'test';
  const tableAItem: TableAInterface = {
    id,
    name: 'test',
    surname: 'test',
  };
  let service: DynamodbService;

  beforeEach(async () => {
    global.console = require('console');
    const MODULE: TestingModule = await Test.createTestingModule({
      providers: [DynamodbService],
    }).compile();
    service = MODULE.get<DynamodbService>(DynamodbService);
  });

  it('should return new item', async () => {
    jest.spyOn(dynamodb, 'put').mockReturnValue({
      promise: () => Promise.resolve(tableAItem),
    });
    expect(
      await service.putItem({ name: 'test', surname: 'test' }, tableName),
    ).toBeTruthy();
  });

  it('should return get item', async () => {
    jest.spyOn(dynamodb, 'get').mockReturnValue({
      promise: () => Promise.resolve({ Item: tableAItem }),
    });
    expect(await service.getItemById({ id }, tableName)).toEqual(tableAItem);
  });
});
