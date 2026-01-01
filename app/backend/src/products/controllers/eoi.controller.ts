import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { EOIService } from '../services/eoi.service.js';
import { CreateEOIDto } from '../dtos/create-eoi.dto.js';
import { UpdateEOIStatusDto } from '../dtos/update-eoi-status.dto.js';
import { EOIFilterDto } from '../dtos/eoi-filter.dto.js';
import { EOIListResponseDto, EOIResponseDto } from '../dtos/eoi-response.dto.js';

@Controller('eoi')
export class EOIController {
  constructor(private readonly eoiService: EOIService) {}

  /**
   * Create a new Expression of Interest
   * POST /eoi
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createEOIDto: CreateEOIDto): Promise<EOIResponseDto> {
    return this.eoiService.create(createEOIDto);
  }

  /**
   * Get all EOIs with optional filters
   * GET /eoi?status=PENDING&initiator=BD_PARTNER&page=1&limit=10
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filters: EOIFilterDto): Promise<EOIListResponseDto> {
    return this.eoiService.findAll(filters);
  }

  /**
   * Get EOI by ID
   * GET /eoi/:id
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: string): Promise<EOIResponseDto> {
    return this.eoiService.findById(id);
  }

  /**
   * Update EOI status
   * PATCH /eoi/:id/status
   */
  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateEOIStatusDto,
  ): Promise<EOIResponseDto> {
    return this.eoiService.updateStatus(id, updateStatusDto);
  }

  /**
   * Accept an EOI
   * PATCH /eoi/:id/accept
   */
  @Patch(':id/accept')
  @HttpCode(HttpStatus.OK)
  async accept(@Param('id') id: string): Promise<EOIResponseDto> {
    return this.eoiService.accept(id);
  }

  /**
   * Reject an EOI
   * PATCH /eoi/:id/reject
   */
  @Patch(':id/reject')
  @HttpCode(HttpStatus.OK)
  async reject(
    @Param('id') id: string,
    @Body() body?: { reason?: string },
  ): Promise<EOIResponseDto> {
    return this.eoiService.reject(id, body?.reason);
  }

  /**
   * Withdraw an EOI
   * PATCH /eoi/:id/withdraw
   */
  @Patch(':id/withdraw')
  @HttpCode(HttpStatus.OK)
  async withdraw(@Param('id') id: string): Promise<EOIResponseDto> {
    return this.eoiService.withdraw(id);
  }

  /**
   * Get all EOIs for a specific product
   * GET /eoi/product/:productId
   */
  @Get('product/:productId')
  @HttpCode(HttpStatus.OK)
  async findByProduct(
    @Param('productId') productId: string,
    @Query() filters: EOIFilterDto,
  ): Promise<EOIListResponseDto> {
    return this.eoiService.findByProduct(productId, filters);
  }

  /**
   * Get EOI statistics for a product
   * GET /eoi/product/:productId/stats
   */
  @Get('product/:productId/stats')
  @HttpCode(HttpStatus.OK)
  async getProductStats(@Param('productId') productId: string) {
    return this.eoiService.getProductEOIStats(productId);
  }

  /**
   * Get all EOIs for a BD partner individual profile
   * GET /eoi/bd-partner/individual/:profileId
   */
  @Get('bd-partner/individual/:profileId')
  @HttpCode(HttpStatus.OK)
  async findByIndividualProfile(
    @Param('profileId') profileId: string,
    @Query() filters: EOIFilterDto,
  ): Promise<EOIListResponseDto> {
    return this.eoiService.findByBDPartnerProfile(
      profileId,
      'individual',
      filters,
    );
  }

  /**
   * Get all EOIs for a BD partner organization profile
   * GET /eoi/bd-partner/organization/:profileId
   */
  @Get('bd-partner/organization/:profileId')
  @HttpCode(HttpStatus.OK)
  async findByOrganizationProfile(
    @Param('profileId') profileId: string,
    @Query() filters: EOIFilterDto,
  ): Promise<EOIListResponseDto> {
    return this.eoiService.findByBDPartnerProfile(
      profileId,
      'organization',
      filters,
    );
  }

  /**
   * Get EOI statistics for a BD partner individual profile
   * GET /eoi/bd-partner/individual/:profileId/stats
   */
  @Get('bd-partner/individual/:profileId/stats')
  @HttpCode(HttpStatus.OK)
  async getIndividualProfileStats(@Param('profileId') profileId: string) {
    return this.eoiService.getBDPartnerEOIStats(profileId, 'individual');
  }

  /**
   * Get EOI statistics for a BD partner organization profile
   * GET /eoi/bd-partner/organization/:profileId/stats
   */
  @Get('bd-partner/organization/:profileId/stats')
  @HttpCode(HttpStatus.OK)
  async getOrganizationProfileStats(@Param('profileId') profileId: string) {
    return this.eoiService.getBDPartnerEOIStats(profileId, 'organization');
  }

  /**
   * Mark expired EOIs (utility endpoint, could be called by a cron job)
   * POST /eoi/mark-expired
   */
  @Post('mark-expired')
  @HttpCode(HttpStatus.OK)
  async markExpired() {
    const count = await this.eoiService.markExpiredEOIs();
    return {
      message: `Marked ${count} EOIs as expired`,
      count,
    };
  }
}
