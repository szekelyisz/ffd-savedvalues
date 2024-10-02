<template>
  <div class="row justify-center">
    <q-select
      :options="allBrands"
      emit-value
      map-options
      v-model="useChartFiltersStore().brand"
      filled
      class="filter-controller q-ma-sm"
      clearable
      label="Brand"
    />
    <q-select
      :options="allFacilityOptions"
      emit-value
      map-options
      v-model="useChartFiltersStore().facilityLocation"
      filled
      class="filter-controller q-ma-sm"
      clearable
      label="Facility"
    />
  </div>
</template>

<script setup lang="ts">
import { Facility } from '@fairfooddata/types';
import { useChartFiltersStore } from 'src/stores/chartFilters';
import { useNftStore } from 'src/stores/nft';
import { computed } from 'vue';

const allBrands = computed(() => [
  { label: 'All brands', value: null },
  ...Array.from(
    new Set(useNftStore().allTokens.map((nft) => nft.instance.ownerId))
  ).map((brandName) => ({ label: brandName, value: brandName })),
]);

const allFacilityOptions = computed(() => [
  { label: 'All facilities', value: null },

  ...useNftStore()
    .allTokens.flatMap((nft) =>
      'process' in nft.instance && nft.instance.process
        ? [nft.instance.process.facility]
        : []
    )
    .reduce<Facility[]>(
      (prev, cur) =>
        prev.find(
          (facility) =>
            facility.label === cur.label &&
            facility.location.coordinates[0] === cur.location.coordinates[0] &&
            facility.location.coordinates[1] === cur.location.coordinates[1]
        ) !== undefined
          ? prev
          : [...prev, cur],
      []
    )
    .map((facility) => ({
      label: facility.label || 'Unnamed Facility',
      value: facility.location,
    })),
]);
</script>
