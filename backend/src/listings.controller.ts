import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';

class CreateListingDto {
  title: string;
  description?: string;
  price: number;
}

@Controller('listings')
@UseGuards(RolesGuard)
export class ListingsController {
  // Allow both 'user' and 'admin' to create listings
  @Roles('user', 'admin')
  @Post()
  create(@Body() dto: CreateListingDto) {
    // In a real app we'd persist to DB; here we return a demo response
    return {
      id: `demo-${Date.now()}`,
      title: dto.title,
      description: dto.description,
      price: dto.price,
      status: 'active',
      created_at: new Date().toISOString(),
    };
  }
}
