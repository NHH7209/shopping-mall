import { IsString } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  label: string;

  @IsString()
  recipient: string;

  @IsString()
  phone: string;

  @IsString()
  address: string;
}
