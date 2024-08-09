<template>
  <q-input
    :rules="[(val) => (Number.isNaN(Date.parse(val)) ? 'Invalid date.' : true)]"
    input-class="cursor-pointer"
    mask="####-##-##"
    v-model="start"
    label="Start Date"
    class="filter-controller q-ma-sm"
    filled
  >
    <q-popup-proxy ref="qDateProxy" :breakpoint="0" behavior="menu">
      <q-date v-model="start" minimal no-unset mask="YYYY-MM-DD">
        <div class="row items-center justify-end">
          <q-btn v-close-popup label="Close" color="primary" flat></q-btn>
        </div>
      </q-date>
    </q-popup-proxy>
    <template v-slot:append>
      <q-icon name="event" class="cursor-pointer"></q-icon>
    </template>
  </q-input>
  <q-input
    :rules="[(val) => (Number.isNaN(Date.parse(val)) ? 'Invalid date.' : true)]"
    input-class="cursor-pointer"
    mask="####-##-##"
    v-model="end"
    label="End Date"
    filled
    class="filter-controller q-ma-sm"
  >
    <q-popup-proxy ref="qDateProxy" :breakpoint="0" behavior="menu">
      <q-date v-model="end" minimal no-unset mask="YYYY-MM-DD">
        <div class="row items-center justify-end">
          <q-btn v-close-popup label="Close" color="primary" flat></q-btn>
        </div>
      </q-date>
    </q-popup-proxy>
    <template v-slot:append>
      <q-icon name="event" class="cursor-pointer"></q-icon>
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { useChartFiltersStore } from 'src/stores/chartFilters';
import { ref, watch } from 'vue';

const start = ref(
  new Date(useChartFiltersStore().startDate * 1000).toISOString()
);
const end = ref(new Date(useChartFiltersStore().endDate * 1000).toISOString());

watch(
  start,
  (newValue) =>
    (useChartFiltersStore().startDate = Date.parse(newValue).valueOf() / 1000)
);
watch(
  end,
  (newValue) =>
    (useChartFiltersStore().endDate = Date.parse(newValue).valueOf() / 1000)
);
</script>
