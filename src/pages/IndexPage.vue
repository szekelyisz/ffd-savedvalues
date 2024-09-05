<template>
  <q-page padding>
    <BrandSavedValues />
  </q-page>
</template>

<script setup lang="ts">
defineOptions({
  name: 'IndexPage',
});

import qs from 'query-string';
import BrandSavedValues from 'src/components/BrandSavedValues.vue';
import { useChartFiltersStore } from 'src/stores/chartFilters';

const args = qs.parse(qs.extract(window.location.href));

useChartFiltersStore().brand =
  typeof args['brand'] === 'string' ? args['brand'] : null;
</script>
