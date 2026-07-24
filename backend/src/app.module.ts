import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RolesGuard } from './roles.guard';
import { AdminController } from './admin.controller';
import { ListingsController } from './listings.controller';

@Module({
  imports: [],
  controllers: [AppController, AdminController, ListingsController],
  providers: [AppService, { provide: APP_GUARD, useClass: RolesGuard }],
})
export class AppModule {}
