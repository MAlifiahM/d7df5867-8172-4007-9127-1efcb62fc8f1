import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'user', required: true, type: String })
  readonly firstname: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '1', required: true, type: String })
  readonly lastname: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'user1@example.com', required: true, type: String })
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Manager', required: true, type: String })
  readonly position: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '1234567890', required: true, type: String })
  readonly phone: string;
}
