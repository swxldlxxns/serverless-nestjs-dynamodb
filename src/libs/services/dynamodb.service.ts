import { Inject, Injectable } from '@nestjs/common';
import { DynamoDB } from 'aws-sdk';

import { DYNAMODB } from '/opt/src/libs/shared/injectables';
import { log } from '/opt/src/libs/utils';

const SERVICE_NAME = 'DynamodbService';

@Injectable()
export class DynamodbService {
  constructor(
    @Inject(DYNAMODB) private readonly _dynamodb: DynamoDB.DocumentClient,
  ) {}

  async putItem<T>(Item: T, TableName: string): Promise<boolean> {
    log('INFO', {
      SERVICE_NAME,
      params: {
        TableName,
        Item,
      },
    });

    await this._dynamodb
      .put({
        TableName,
        Item,
      })
      .promise();

    return true;
  }

  async getItemById<T>(Key: object, TableName: string): Promise<T> {
    const value = await this._dynamodb
      .get({
        TableName,
        Key,
        ConsistentRead: true,
      })
      .promise();

    return <T>value.Item;
  }
}
