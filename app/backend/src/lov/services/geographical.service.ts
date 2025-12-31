import { Injectable } from '@nestjs/common';
import { getCountries, getStatesOfCountry, getCitiesOfState } from '@countrystatecity/countries';

@Injectable()
export class GeographicalService {
  /**
   * Get all countries
   * Returns lightweight country data (~5KB)
   */
  async getCountries() {
    try {
      const countries = await getCountries();
      return countries.map(country => ({
        id: country.iso2,
        name: country.name,
        iso2: country.iso2,
        iso3: country.iso3,
        emoji: country.emoji,
      }));
    } catch (error) {
      throw new Error(`Failed to fetch countries: ${error.message}`);
    }
  }

  /**
   * Get all states/provinces in a country
   * @param iso2Code - Country ISO2 code (e.g., 'US', 'IN', 'GB')
   * Returns state data (~10-100KB depending on country)
   */
  async getStatesByCountry(iso2Code: string) {
    try {
      const states = await getStatesOfCountry(iso2Code);
        console.log("States fetched:", states);

      return states.map(state => ({
        id: state.iso2,
        name: state.name,
        iso2: state.iso2,
        countryCode: iso2Code,
      }));
    } catch (error) {
      throw new Error(`Failed to fetch states for ${iso2Code}: ${error.message}`);
    }
  }

  /**
   * Get all cities in a state/province
   * @param countryCode - Country ISO2 code (e.g., 'US')
   * @param stateCode - State ISO2 code (e.g., 'CA')
   * Returns city data (~5-200KB depending on state)
   */
  async getCitiesByState(countryCode: string, stateCode: string) {
    try {
      const cities = await getCitiesOfState(countryCode, stateCode);
      return cities.map(city => ({
        id: city.id,
        name: city.name,
        latitude: city.latitude,
        longitude: city.longitude,
        countryCode,
        stateCode,
      }));
    } catch (error) {
      throw new Error(`Failed to fetch cities for ${countryCode}/${stateCode}: ${error.message}`);
    }
  }
}
