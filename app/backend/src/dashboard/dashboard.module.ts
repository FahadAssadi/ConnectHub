import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module.js';
import { CompanyDashboardController } from './controllers/company-dashboard.controller.js';
import { CompanyDashboardService } from './services/company-dashboard.service.js';


@Module({
    imports: [DatabaseModule],
    controllers: [CompanyDashboardController],
    providers: [CompanyDashboardService],
    exports: [CompanyDashboardService],
})
export class DashboardModule {}
