import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Audit } from './schemas/audit.schema';

@Injectable()
export class AuditService {
  constructor(@InjectModel(Audit.name) private auditModel: Model<Audit>) {}

  async log(userId: string, action: string, meta: any = {}) {
    return this.auditModel.create({ userId, action, meta });
  }
}
