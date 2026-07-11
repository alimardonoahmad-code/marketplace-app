import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLog } from '../entities/activity-log.entity';

@Injectable()
export class AdminActivityService {
  constructor(
    @InjectRepository(ActivityLog)
    private logRepository: Repository<ActivityLog>,
  ) {}

  async log(params: {
    adminId: string;
    action: string;
    entity: string;
    entityId?: string;
    details?: string;
    ipAddress?: string;
  }) {
    const entry = this.logRepository.create(params);
    return this.logRepository.save(entry);
  }

  async getLogs(page = 1, limit = 30) {
    const [items, total] = await this.logRepository.findAndCount({
      relations: ['admin'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}
