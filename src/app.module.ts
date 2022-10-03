import { Module } from '@nestjs/common';

import { AppService } from '/opt/src/app.service';
import { DynamodbService } from '/opt/src/libs/services/dynamodb.service';

@Module({
  providers: [AppService, DynamodbService],
})
export class AppModule {}
