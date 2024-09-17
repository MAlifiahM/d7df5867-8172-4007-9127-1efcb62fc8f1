import { Injectable, NotFoundException } from '@nestjs/common';
import { EmployeeRepository } from '../../infrastructure/repositories/employee.repository';
import { CreateEmployeeDto } from '../../infrastructure/dtos/create-employee.dto';
import { UpdateEmployeeDto } from '../../infrastructure/dtos/update-employee.dto';

@Injectable()
export class EmployeeService {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    return this.employeeRepository.create(createEmployeeDto);
  }

  async findAll(query: any) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'firstname',
      order = 'asc',
      ...filters
    } = query;

    const skip = (page - 1) * limit;
    const sortOrder = order === 'asc' ? 1 : -1;

    // Validate sortBy to ensure it's only a valid field
    const validSortFields = ['firstname', 'lastname', 'position'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'firstname';

    const employees = await this.employeeRepository.findAll(
      filters,
      sortField,
      sortOrder,
      skip,
      parseInt(limit),
    );

    return {
      data: employees.data,
      currentPage: page,
      maxPages: employees.totalPages,
    };
  }

  async findOne(id: string) {
    const employee = await this.employeeRepository.findOne(id);
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    return employee;
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    const updatedEmployee = await this.employeeRepository.update(
      id,
      updateEmployeeDto,
    );
    if (!updatedEmployee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    return updatedEmployee;
  }

  async remove(id: string) {
    const employee = await this.employeeRepository.remove(id);
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    return employee;
  }
}
