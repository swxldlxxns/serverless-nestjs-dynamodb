import { Injectable } from '@nestjs/common';
import { DynamoDB } from 'aws-sdk';

import { ENV_VARS } from '/opt/src/libs/shared/enviroments';

const SERVICE_NAME = 'DynamodbService';
const { region } = ENV_VARS;
const dynamodb = new DynamoDB.DocumentClient({
  region,
  apiVersion: 'latest',
});

@Injectable()
export class DynamodbService {
  async putItem<T>(Item: T, TableName: string): Promise<boolean> {
    console.log({
      SERVICE_NAME,
      params: {
        TableName,
        Item,
      },
    });

    await dynamodb
      .put({
        TableName,
        Item,
      })
      .promise();
    return true;
  }

  async getItemById<T>(Key: object, TableName: string): Promise<T> {
    const value = await dynamodb
      .get({
        TableName,
        Key,
        ConsistentRead: true,
      })
      .promise();
    return <T>value.Item;
  }
}
