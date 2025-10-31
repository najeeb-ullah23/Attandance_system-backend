import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from './company.schema';

@Injectable()
export class CompanyService {
  constructor(@InjectModel(Company.name) private companyModel: Model<Company>) {}

  async create(data: Partial<Company>) {
    const company = await this.companyModel.create(data);
    return company;
  }

  async findByOwner(ownerId: string) {
    return this.companyModel.findOne({ owner: ownerId });
  }

  async findAll() {
    return this.companyModel.find().populate('owner');
  }

  async update(id: string, data: Partial<Company>) {
    const company = await this.companyModel.findByIdAndUpdate(id, data, { new: true });
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async delete(id: string) {
    const company = await this.companyModel.findByIdAndDelete(id);
    if (!company) throw new NotFoundException('Company not found');
    return { message: 'Company deleted successfully' };
  }
}
