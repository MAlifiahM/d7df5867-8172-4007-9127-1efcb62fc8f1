import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateEmployeeDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'John', required: false, type: String })
  readonly firstname?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Doe', required: false, type: String })
  readonly lastname?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Manager', required: false, type: String })
  readonly position?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '1234567890', required: false, type: String })
  readonly phone?: string;

  @IsOptional()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'JohnDoe@example.com',
    required: false,
    type: String,
  })
  readonly email?: string;
}
