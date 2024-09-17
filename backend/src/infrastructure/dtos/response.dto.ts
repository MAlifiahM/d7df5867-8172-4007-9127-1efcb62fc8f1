import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto<T> {
  @ApiProperty({ example: 200 })
  statusCode: number;
  @ApiProperty({ example: 'Employees retrieved successfully' })
  message: string;
  @ApiProperty({ example: 1, description: 'Current page just on find All' })
  currentPage?: number;
  @ApiProperty({
    example: 1,
    description: 'Maximum number of pages just on find All',
  })
  totalPages?: number;
  @ApiProperty({
    example: [
      {
        firstname: 'John',
        lastname: 'Doe',
        position: 'Developer',
        phone: '123456789',
        email: 'yKQpF@example.com',
      },
    ],
    description: 'On delete, and error this object is not available',
  })
  data?: T;
}
