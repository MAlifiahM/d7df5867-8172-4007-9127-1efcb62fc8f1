import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Employee } from '../../domain/entities/employee.entity';
import { CreateEmployeeDto } from '../dtos/create-employee.dto';
import { UpdateEmployeeDto } from '../dtos/update-employee.dto';

export class EmployeeRepository {
  constructor(
    @InjectModel(Employee.name) private employeeModel: Model<Employee>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const employee = new this.employeeModel(createEmployeeDto);
    return employee.save();
  }

  async findAll(
    filters: { [key: string]: any },
    sortBy: string,
    sortOrder: number,
    skip: number,
    limit: number,
  ): Promise<{ data: Employee[]; totalPages: number }> {
    const sortDirection = sortOrder === 1 ? 1 : -1;
    const sort: { [key: string]: 1 | -1 } = { [sortBy]: sortDirection };

    const transformedFilters = {};
    for (const key in filters) {
      transformedFilters[key] = { $regex: filters[key], $options: 'i' };
    }

    const totalItems = await this.employeeModel
      .countDocuments(transformedFilters)
      .exec();
    const totalPages = Math.ceil(totalItems / limit);

    const data = await this.employeeModel
      .find(transformedFilters)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    return {
      data: data,
      totalPages: totalPages,
    };
  }

  async findOne(id: string): Promise<Employee> {
    return this.employeeModel.findById(id);
  }

  async update(
    id: string,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    return this.employeeModel.findByIdAndUpdate(id, updateEmployeeDto, {
      new: true,
    });
  }

  async remove(id: string): Promise<Employee> {
    return this.employeeModel.findByIdAndDelete(id);
  }
}
