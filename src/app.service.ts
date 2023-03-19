import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APIGatewayProxyResult } from 'aws-lambda';
import { v4 as idV4 } from 'uuid';

import { CreateRequestsDto } from '/opt/src/libs/dtos/requests/create-requests.dto';
import { TableAInterface } from '/opt/src/libs/interfaces/dynamodb/tablea.interface';
import { EnvironmentInterface } from '/opt/src/libs/interfaces/environment.interface';
import { CreateResponseInterface } from '/opt/src/libs/interfaces/responses.interface';
import { DynamodbService } from '/opt/src/libs/services/dynamodb.service';
import { errorResponse, formatResponse } from '/opt/src/libs/utils';

const SERVICE_NAME = 'AppService';

@Injectable()
export class AppService {
  private readonly _tableA: string;

  constructor(
    private readonly _dynamoService: DynamodbService,
    private readonly _configService: ConfigService,
  ) {
    const { tableA }: EnvironmentInterface =
      this._configService.get<EnvironmentInterface>('config');

    this._tableA = tableA;
  }

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
        this._tableA,
      );
      const newValue: CreateResponseInterface =
        await this._dynamoService.getItemById<TableAInterface>(
          { id },
          this._tableA,
        );

      return formatResponse<CreateResponseInterface>(newValue, SERVICE_NAME);
    } catch (e) {
      return errorResponse(e, SERVICE_NAME);
    }
  }
}
