import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { GetItemCommandOutput } from '@aws-sdk/client-dynamodb/dist-types/commands/GetItemCommand';
import { PutItemCommandOutput } from '@aws-sdk/client-dynamodb/dist-types/commands/PutItemCommand';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { Inject, Injectable } from '@nestjs/common';

import { DYNAMODB } from '/opt/src/libs/shared/injectables';
import { log } from '/opt/src/libs/utils';

const SERVICE_NAME = 'DynamodbService';

@Injectable()
export class DynamodbService {
  constructor(@Inject(DYNAMODB) private readonly _dynamodb: DynamoDB) {}

  async putItem(
    Item: object,
    TableName: string,
  ): Promise<PutItemCommandOutput> {
    log('INFO', {
      SERVICE_NAME,
      params: {
        TableName,
        Item,
      },
    });

    return await this._dynamodb.putItem({
      TableName,
      Item: marshall(Item),
    });
  }

  async getItemById<T>(Key: object, TableName: string): Promise<T> {
    const value: GetItemCommandOutput = await this._dynamodb.getItem({
      TableName,
      Key: marshall(Key),
      ConsistentRead: true,
    });

    return unmarshall(value.Item) as T;
  }
}
