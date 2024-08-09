<template>
  <q-page padding>
    <BrandSavedValues :brand="brand" />
  </q-page>
</template>

<script setup lang="ts">
defineOptions({
  name: 'IndexPage',
});

import qs from 'query-string';
import BrandSavedValues from 'src/components/BrandSavedValues.vue';
import { computed } from 'vue';

const brand = computed((): string | undefined => {
  const args = qs.parse(qs.extract(window.location.href));

  return typeof args['brand'] === 'string' ? args['brand'] : undefined;
});
</script>
