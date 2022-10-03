import { Injectable } from '@nestjs/common';
import { APIGatewayProxyResult } from 'aws-lambda';
import { v4 as idV4 } from 'uuid';

import { TableAInterface } from '/opt/src/libs/interfaces/dynamodb/tablea.interface';
import { CreateRequestsDto } from '/opt/src/libs/interfaces/request/create-requests.dto';
import { CreateResponseInterface } from '/opt/src/libs/interfaces/response/create-response.interface';
import { DynamodbService } from '/opt/src/libs/services/dynamodb.service';
import { ENV_VARS } from '/opt/src/libs/shared/enviroments';
import { errorResponse, formatResponse } from '/opt/src/libs/utils';

const SERVICE_NAME = 'AppService';
const { tableA } = ENV_VARS;

@Injectable()
export class AppService {
  constructor(private readonly _dynamoService: DynamodbService) {}
  async create({
    name,
    surname,
  }: CreateRequestsDto): Promise<APIGatewayProxyResult> {
    try {
      const id: string = idV4();
      await this._dynamoService.putItem<TableAInterface>(
        {
          id,
          name,
          surname,
        },
        tableA,
      );
      const newValue: CreateResponseInterface =
        await this._dynamoService.getItemById<TableAInterface>({ id }, tableA);
      return formatResponse<CreateResponseInterface>(newValue, SERVICE_NAME);
    } catch (e) {
      return errorResponse(e, SERVICE_NAME);
    }
  }
}
