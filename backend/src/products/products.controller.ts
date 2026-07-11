import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseInterceptors,
  UploadedFiles,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from './dto/product.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators';
import { UserRole } from '../common/enums';
import { User } from '../entities/user.entity';
import { Public } from '../common/decorators';

const imageStorage = diskStorage({
  destination: './uploads/products',
  filename: (_req, file, cb) => {
    const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Public()
  @Get()
  findAll(@Query() query: ProductQueryDto, @CurrentUser() user?: User) {
    return this.productsService.findAll(query, user);
  }

  @Public()
  @Get('suggestions')
  getSuggestions(@Query('q') q: string, @Query('limit') limit?: number) {
    return this.productsService.getSuggestions(q, limit ? Number(limit) : 8);
  }

  @Public()
  @Get('recommended')
  getRecommended(@CurrentUser() user?: User) {
    return this.productsService.getRecommended(user?.id);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user?: User) {
    return this.productsService.findOne(id, user);
  }

  @Roles(UserRole.SELLER, UserRole.ADMIN)
  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 5, {
      storage: imageStorage,
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp|gif)$/)) {
          cb(new Error('Only image files allowed'), false);
        } else {
          cb(null, true);
        }
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  create(
    @Body() dto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
    @CurrentUser() user: User,
  ) {
    if (files?.length) {
      dto.images = files.map((f) => `/uploads/products/${f.filename}`);
    }
    return this.productsService.create(dto, user);
  }

  @Roles(UserRole.SELLER, UserRole.ADMIN)
  @Put(':id')
  @UseInterceptors(
    FilesInterceptor('images', 5, {
      storage: imageStorage,
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp|gif)$/)) {
          cb(new Error('Only image files allowed'), false);
        } else {
          cb(null, true);
        }
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
    @CurrentUser() user: User,
  ) {
    if (files?.length) {
      dto.images = files.map((f) => `/uploads/products/${f.filename}`);
    }
    return this.productsService.update(id, dto, user);
  }

  @Roles(UserRole.SELLER, UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.productsService.remove(id, user);
  }
}
