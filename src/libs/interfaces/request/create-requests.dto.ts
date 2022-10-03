import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRequestsDto {
  @IsNotEmpty()
  @IsString()
  @Expose()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  readonly surname: string;
}
