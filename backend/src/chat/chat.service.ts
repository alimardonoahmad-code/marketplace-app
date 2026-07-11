import {
  Injectable, NotFoundException, ForbiddenException, BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Conversation } from '../entities/conversation.entity';
import { Message } from '../entities/message.entity';
import { User } from '../entities/user.entity';
import { UserRole } from '../common/enums';
import { StartConversationDto, SendMessageDto } from './dto/chat.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../entities/notification.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private notificationsService: NotificationsService,
  ) {}

  async getConversations(userId: string) {
    return this.conversationRepository
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.buyer', 'buyer')
      .leftJoinAndSelect('c.seller', 'seller')
      .leftJoinAndSelect('c.product', 'product')
      .where('c.buyerId = :userId OR c.sellerId = :userId', { userId })
      .orderBy('c.updatedAt', 'DESC')
      .getMany();
  }

  async getMessages(conversationId: string, userId: string) {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
    });
    if (!conversation) throw new NotFoundException('Conversation not found');
    if (conversation.buyerId !== userId && conversation.sellerId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    await this.messageRepository.update(
      { conversationId, isRead: false },
      { isRead: true },
    );

    return this.messageRepository.find({
      where: { conversationId },
      relations: ['sender'],
      order: { createdAt: 'ASC' },
    });
  }

  async startConversation(user: User, dto: StartConversationDto) {
    if (user.id === dto.sellerId) {
      throw new BadRequestException('Cannot chat with yourself');
    }

    let conversation = await this.conversationRepository.findOne({
      where: {
        buyerId: user.id,
        sellerId: dto.sellerId,
        productId: dto.productId ? dto.productId : IsNull(),
      },
    });

    if (!conversation) {
      conversation = this.conversationRepository.create({
        buyerId: user.id,
        sellerId: dto.sellerId,
        productId: dto.productId,
      });
      conversation = await this.conversationRepository.save(conversation);
    }

    if (dto.message) {
      await this.sendMessage(conversation.id, user, { content: dto.message });
    }

    return conversation;
  }

  async sendMessage(conversationId: string, user: User, dto: SendMessageDto) {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
    });
    if (!conversation) throw new NotFoundException('Conversation not found');
    if (conversation.buyerId !== user.id && conversation.sellerId !== user.id) {
      throw new ForbiddenException('Access denied');
    }

    const message = this.messageRepository.create({
      conversationId,
      senderId: user.id,
      content: dto.content,
    });
    const saved = await this.messageRepository.save(message);

    conversation.updatedAt = new Date();
    await this.conversationRepository.save(conversation);

    const recipientId = user.id === conversation.buyerId
      ? conversation.sellerId
      : conversation.buyerId;

    await this.notificationsService.create(
      recipientId,
      'Паёми нав',
      dto.content.slice(0, 100),
      NotificationType.CHAT,
      `/chat?c=${conversationId}`,
    );

    return this.messageRepository.findOne({
      where: { id: saved.id },
      relations: ['sender'],
    });
  }
}
