import { Body, Controller, Get, Post, Put, Param, UseGuards } from '@nestjs/common';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';

// Demo DTOs
class AuthorizeUserDto {
  userId: string;
  role: string;
}

@Controller('admin')
@UseGuards(RolesGuard)
export class AdminController {
  // Require admin role for all admin routes
  @Roles('admin')
  @Get('health')
  health() {
    return { ok: true, role: 'admin' };
  }

  @Roles('admin')
  @Post('authorize')
  authorizeUser(@Body() dto: AuthorizeUserDto) {
    // In a real app this would create a mapping in user_roles table.
    return { message: `User ${dto.userId} authorized with role ${dto.role}` };
  }

  @Roles('admin')
  @Put('revoke/:userId/:role')
  revokeRole(@Param('userId') userId: string, @Param('role') role: string) {
    return { message: `Role ${role} revoked from user ${userId}` };
  }
}
