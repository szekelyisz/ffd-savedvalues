import { defineStore } from 'pinia';
import { Pokedex, Location } from '@fairfooddata/types';
import { useChartFiltersStore } from './chartFilters';

interface Token {
  id: string;
  metadata: Pokedex;
}

export const useNftStore = defineStore('nft', {
  state: () => ({
    nfts: [] as Token[],
  }),
  getters: {
    filteredTokens: (state) =>
      state.nfts.filter(
        ({ metadata: { instance } }) =>
          instance.category === 'food' &&
          'process' in instance &&
          instance.process !== undefined &&
          instance.process.timestamp >= useChartFiltersStore().startDate &&
          instance.process.timestamp <= useChartFiltersStore().endDate &&
          (useChartFiltersStore().facilityLocation === null ||
            coincident(
              instance.process.facility.location,
              useChartFiltersStore().facilityLocation
            )) &&
          (useChartFiltersStore().brand === null ||
            instance.ownerId === useChartFiltersStore().brand)
      ),
    allTokens: (state) => state.nfts.map((token) => token.metadata),
  },
});

function coincident(a: Location | null, b: Location | null) {
  return (
    a !== null &&
    b !== null &&
    a.coordinates[0] === b.coordinates[0] &&
    a.coordinates[1] === b.coordinates[1]
  );
}
