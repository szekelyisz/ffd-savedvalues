import { Location } from '@fairfooddata/types';
import { defineStore } from 'pinia';

interface ChartFilters {
  brand: string | null;
  facilityLocation: Location | null;
  startDate: number;
  endDate: number;
}

export const useChartFiltersStore = defineStore('chartFilters', {
  state: (): ChartFilters => ({
    facilityLocation: null,
    brand: null,
    /* unix timestamp, in seconds */
    startDate: (Date.now() - 4 * 7 * 24 * 60 * 60 * 1000) / 1000,
    /* unix timestamp, in seconds */
    endDate: Date.now() / 1000,
  }),
});
