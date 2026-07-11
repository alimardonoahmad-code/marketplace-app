import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class StartConversationDto {
  @IsUUID()
  sellerId: string;

  @IsOptional()
  @IsUUID()
  productId?: string;

  @IsOptional()
  @IsString()
  message?: string;
}

export class SendMessageDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}
