import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module.js';
import { CompanyDashboardController } from './controllers/company-dashboard.controller.js';
import { CompanyDashboardService } from './services/company-dashboard.service.js';
import { BDPartnerDashboardController } from './controllers/bd-partner-dashboard.controller.js';
import { BDPartnerDashboardService } from './services/bd-partner-dashboard.service.js';


@Module({
    imports: [DatabaseModule],
    controllers: [CompanyDashboardController, BDPartnerDashboardController],
    providers: [CompanyDashboardService, BDPartnerDashboardService],
    exports: [CompanyDashboardService, BDPartnerDashboardService],
})
export class DashboardModule {}
