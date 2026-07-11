import { Controller, Get } from '@nestjs/common';
import { Public } from '../common/decorators';
import { AdminService } from './admin.service';

@Controller('cms')
export class CmsController {
  constructor(private adminService: AdminService) {}

  @Public()
  @Get('banners')
  getBanners() {
    return this.adminService.getActiveBanners();
  }

  @Public()
  @Get('faq')
  getFaq() {
    return this.adminService.getActiveFaq();
  }
}
