import { Controller, Get, Param } from '@nestjs/common';
import { GeographicalService } from '../services/geographical.service.js';

@Controller('lov/geographical')
export class GeographicalController {
  constructor(private readonly service: GeographicalService) {}

  /**
   * Get all countries
   * GET /lov/geographical/countries
   */
  @Get('countries')
  getCountries() {
    return this.service.getCountries();
  }

  /**
   * Get all states/provinces in a country
   * GET /lov/geographical/countries/:iso2Code/states
   */
  @Get('countries/:iso2Code/states')
  getStatesByCountry(@Param('iso2Code') iso2Code: string) {
    return this.service.getStatesByCountry(iso2Code);
  }

  /**
   * Get all cities in a state/province
   * GET /lov/geographical/countries/:countryCode/states/:stateCode/cities
   */
  @Get('countries/:countryCode/states/:stateCode/cities')
  getCitiesByState(
    @Param('countryCode') countryCode: string,
    @Param('stateCode') stateCode: string,
  ) {
    return this.service.getCitiesByState(countryCode, stateCode);
  }
}
