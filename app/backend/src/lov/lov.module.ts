import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module.js';

// Controllers
import { IndustryCategoryController } from './controllers/industry-category.controller.js';
import { IndustrySubCategoryController } from './controllers/industry-sub-category.controller.js';
import { IndustrySpecialisationController } from './controllers/industry-specialisation.controller.js';
import { EngagementModelController } from './controllers/engagement-model.controller.js';
import { IncentiveMethodController } from './controllers/incentive-method.controller.js';
import { YearsOfExperienceController } from './controllers/years-of-experience.controller.js';
import { BuisnessStructureController } from './controllers/buisness-structure.controller.js';
import { ToolPlatformController } from './controllers/tool-platform.controller.js';
import { CertificationController } from './controllers/certification.controller.js';

// Services
import { IndustryCategoryService } from './services/industry-category.service.js';
import { IndustrySubCategoryService } from './services/industry-sub-category.service.js';
import { IndustrySpecialisationService } from './services/industry-specialisation.service.js';
import { EngagementModelService } from './services/engagement-model.service.js';
import { IncentiveMethodService } from './services/incentive-method.service.js';
import { YearsOfExperienceService } from './services/years-of-experience.service.js';
import { BuisnessStructureService } from './services/buisness-structure.service.js';
import { ToolPlatformService } from './services/tool-platform.service.js';
import { CertificationService } from './services/certification.service.js';

@Module({
  imports: [DatabaseModule],
  providers: [
    IndustryCategoryService,
    IndustrySubCategoryService,
    IndustrySpecialisationService,
    EngagementModelService,
    IncentiveMethodService,
    YearsOfExperienceService,
    BuisnessStructureService,
    ToolPlatformService,
    CertificationService,
  ],
  controllers: [
    IndustryCategoryController,
    IndustrySubCategoryController,
    IndustrySpecialisationController,
    EngagementModelController,
    IncentiveMethodController,
    YearsOfExperienceController,
    BuisnessStructureController,
    ToolPlatformController,
    CertificationController,
  ],
  exports: [
    IndustryCategoryService,
    IndustrySubCategoryService,
    IndustrySpecialisationService,
    EngagementModelService,
    IncentiveMethodService,
    YearsOfExperienceService,
    BuisnessStructureService,
    ToolPlatformService,
    CertificationService,
  ],
})
export class LovModule {}
