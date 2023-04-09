import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';

import { AppService } from '/opt/src/app.service';
import config from '/opt/src/config';
import { DynamodbService } from '/opt/src/libs/services/dynamodb.service';
import { DYNAMODB } from '/opt/src/libs/shared/injectables';

const apiVersion = 'latest';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
  ],
  providers: [
    AppService,
    DynamodbService,
    {
      provide: DYNAMODB,
      inject: [config.KEY],
      useFactory: ({ region }: ConfigType<typeof config>) =>
        new DynamoDB({
          apiVersion,
          region,
        }),
    },
  ],
})
export class AppModule {}
