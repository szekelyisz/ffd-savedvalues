<template>
  <div v-if="listRequest.isFetching.value" class="fixed-center">
    <div class="column content-center items-center">
      <q-spinner size="4em" />
      <div class="q-py-md">Fetching NFTs</div>
    </div>
  </div>
  <div v-else-if="listRequest.error.value !== null" class="fixed-center">
    <div class="column content-center items-center">
      <q-icon name="error" size="4em" />
      <div class="q-py-md">Error: {{ listRequest.error }}</div>
    </div>
  </div>
  <div v-else-if="listRequest.isFinished">
    <div class="row justify-center">
      <BrandFacilityFilter />
      <DateRangeFilter />
    </div>
    <InputOutputWeightChart />
  </div>
</template>

<script setup lang="ts">
import { Pokedex } from '@fairfooddata/types';
import { useFetch } from '@vueuse/core';
import { useNftStore } from 'src/stores/nft';
// import { computed } from 'vue';
import DateRangeFilter from 'src/components/DateRangeFilter.vue';
import InputOutputWeightChart from './InputOutputWeightChart.vue';
import BrandFacilityFilter from './BrandFacilityFilter.vue';

type TokenHistory = {
  tokenId: string;
  hashes: string[];
}[];

type MetadataResponse = {
  swarnReference: string;
  content: Pokedex;
};

const props = defineProps<{ brand: string | undefined }>();

const listRequest = useFetch<TokenHistory>(
  `${process.env.BACKEND_URL}/list${
    props.brand
      ? `?filter=${encodeURIComponent(
          `instance.ownerId="${props.brand.replaceAll('"', '\\"')}"`
        )}`
      : ''
  }`
).json();

listRequest.then((response) => {
  if (response.data.value === null) return;

  for (const history of response.data.value) {
    const metadataRequest = useFetch<MetadataResponse>(
      `${process.env.BACKEND_URL}/metadata/${history.tokenId}`
    ).json<MetadataResponse>();
    metadataRequest.then((response) =>
      response.data.value !== null
        ? useNftStore().nfts.push(response.data.value.content)
        : null
    );
    metadataRequests.push(metadataRequest);
  }
});

const metadataRequests: ReturnType<typeof useFetch>[] = [];

// const nPendingMetadataRequests = computed(() =>
//   metadataRequests.reduce((prev, cur) => prev + (cur.isFinished ? 0 : 1), 0)
// );
</script>
