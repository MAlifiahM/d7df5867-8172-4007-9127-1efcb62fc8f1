import {
  Body,
  Controller,
  Delete,
  Get,
  Res,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import { EmployeeService } from '../../application/services/employee.service';
import { CreateEmployeeDto } from '../dtos/create-employee.dto';
import { UpdateEmployeeDto } from '../dtos/update-employee.dto';
import { ResponseDto } from '../dtos/response.dto';
import { Employee } from '../../domain/entities/employee.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('employees')
@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @ApiOperation({ summary: 'Create an employee' })
  @ApiResponse({
    status: 201,
    description: 'The employee has been successfully created',
    type: ResponseDto,
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBody({ type: CreateEmployeeDto })
  async create(
    @Body() createEmployeeDto: CreateEmployeeDto,
    @Res() res: Response,
  ) {
    try {
      const data = await this.employeeService.create(createEmployeeDto);
      const response: ResponseDto<Employee> = {
        statusCode: HttpStatus.CREATED,
        message: 'Employee created successfully',
        data,
      };
      return res.status(HttpStatus.CREATED).json(response);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to create employee : ' + error,
      });
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all employees' })
  @ApiResponse({
    status: 200,
    description: 'The employees have been successfully retrieved',
    type: [ResponseDto],
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    example: '1',
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    example: '10',
    description: 'Number of employees per page',
  })
  @ApiQuery({
    name: 'sortBy',
    type: String,
    required: false,
    example: 'firstname',
    description: 'Field to sort by',
  })
  @ApiQuery({
    name: 'order',
    type: String,
    required: false,
    example: 'asc',
    description: 'Sort order (asc or desc)',
  })
  @ApiQuery({
    name: 'position',
    type: String,
    required: false,
    example: 'Manager',
    description:
      'Query filters ( change filters with field for example "position" and value is "CEO" )',
  })
  async findAll(@Query() query: { [key: string]: any }, @Res() res: Response) {
    try {
      const data = await this.employeeService.findAll(query);
      const response: ResponseDto<Employee[]> = {
        statusCode: HttpStatus.OK,
        message: 'Employees retrieved successfully',
        currentPage: data.currentPage,
        totalPages: data.maxPages,
        data: data.data,
      };
      return res.status(HttpStatus.OK).json(response);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to retrieve employees : ' + error,
      });
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an employee by ID' })
  @ApiResponse({
    status: 200,
    description: 'The employee has been successfully retrieved',
    type: ResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const data = await this.employeeService.findOne(id);
      if (data) {
        const response: ResponseDto<Employee> = {
          statusCode: HttpStatus.OK,
          message: 'Employee retrieved successfully',
          data,
        };
        return res.status(HttpStatus.OK).json(response);
      } else {
        const response: ResponseDto<Employee> = {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Employee not found',
          data,
        };
        return res.status(HttpStatus.NOT_FOUND).json(response);
      }
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to retrieve employee : ' + error,
      });
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an employee by ID' })
  @ApiResponse({
    status: 200,
    description: 'The employee has been successfully updated',
    type: ResponseDto,
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBody({ type: UpdateEmployeeDto })
  async update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
    @Res() res: Response,
  ) {
    try {
      const data = await this.employeeService.update(id, updateEmployeeDto);
      const response: ResponseDto<Employee> = {
        statusCode: HttpStatus.OK,
        message: 'Employee updated successfully',
        data,
      };
      return res.status(HttpStatus.OK).json(response);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to update employee : ' + error,
      });
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove an employee by ID' })
  @ApiResponse({
    status: 200,
    description: 'The employee has been successfully removed',
    type: ResponseDto,
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.employeeService.remove(id);
      const response: ResponseDto<Employee> = {
        statusCode: HttpStatus.OK,
        message: 'Employee removed successfully',
      };
      return res.status(HttpStatus.OK).json(response);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to remove employee : ' + error,
      });
    }
  }
}
