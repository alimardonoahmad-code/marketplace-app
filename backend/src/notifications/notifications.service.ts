import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from '../entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async create(
    userId: string,
    title: string,
    message: string,
    type: NotificationType = NotificationType.SYSTEM,
    link?: string,
  ) {
    const notification = this.notificationRepository.create({
      userId, title, message, type, link,
    });
    return this.notificationRepository.save(notification);
  }

  async findByUser(userId: string) {
    return this.notificationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }

  async getUnreadCount(userId: string) {
    return this.notificationRepository.count({ where: { userId, isRead: false } });
  }

  async markRead(id: string, userId: string) {
    const n = await this.notificationRepository.findOne({ where: { id, userId } });
    if (n) {
      n.isRead = true;
      await this.notificationRepository.save(n);
    }
    return n;
  }

  async markAllRead(userId: string) {
    await this.notificationRepository.update({ userId, isRead: false }, { isRead: true });
    return { message: 'All marked as read' };
  }
}
