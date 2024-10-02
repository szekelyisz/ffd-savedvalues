<template>
  <div v-if="listRequest.error.value !== undefined" class="fixed-center">
    <div class="column content-center items-center">
      <q-icon name="error" size="4em" />
      <div class="q-py-md">Error: {{ listRequest.error }}</div>
    </div>
  </div>
  <div else>
    <div class="row justify-center">
      <BrandFacilityFilter />
      <DateRangeFilter />
    </div>
    <InputOutputWeightChart />
    <ProcessTable />
  </div>
  <q-page-sticky v-if="progressText !== undefined" :offset="[16, 16]">
    <q-card>
      <q-circular-progress
        indeterminate
        color="primary"
        size="4em"
        class="q-ma-md"
        style="position: relative; opacity: 0.5"
      />
      <q-circular-progress
        style="position: absolute; left: 0; top: 0"
        show-value
        font-size="12px"
        size="4em"
        color="primary"
        class="q-ma-md"
        :min="0"
        :value="nCompletedMetadataRequests"
        :max="listRequest.data.value?.metadataUpdateds.length"
        >{{ progressText }}</q-circular-progress
      >
    </q-card>
  </q-page-sticky>
</template>

<script setup lang="ts">
import { Pokedex } from '@fairfooddata/types';
import { useNftStore } from 'src/stores/nft';
import DateRangeFilter from 'src/components/DateRangeFilter.vue';
import InputOutputWeightChart from './InputOutputWeightChart.vue';
import BrandFacilityFilter from './BrandFacilityFilter.vue';
import ProcessTable from './ProcessTable.vue';

import {
  Client,
  provideClient,
  cacheExchange,
  fetchExchange,
  useQuery,
  gql,
} from '@urql/vue';
import { Bee, Data, FileData } from '@ethersphere/bee-js';
import { computed, ref, Ref } from 'vue';
import { useAsyncState, UseAsyncStateReturn } from '@vueuse/core';

type MetadataUpdated = {
  // id: string;
  tokenId: string;
  // owner: string;
  swarmHash: string;
  // blockNumber: string;
  // blockTimestamp: string;
  // transactionHash: string;
};

const client = new Client({
  url: process.env.GQL_URL,
  exchanges: [cacheExchange, fetchExchange],
});

provideClient(client);

const listRequest = useQuery<{ metadataUpdateds: MetadataUpdated[] }>({
  query: gql`
    {
      metadataUpdateds {
        tokenId
        swarmHash
      }
    }
  `,
});

listRequest.then(async (response) => {
  if (response.data.value === undefined) return;

  metadataRequests.value.splice(0);
  useNftStore().nfts.splice(0);

  for (const event of response.data.value.metadataUpdateds) {
    const metadataRequest = new Bee(process.env.SWARM_API_URL).downloadFile(
      BigInt(event.swarmHash).toString(16).padStart(64, '0'),
      undefined,
      { timeout: false }
    );

    metadataRequest
      .then((response) => {
        try {
          useNftStore().nfts.push({
            id: event.tokenId,
            metadata: response.data.json() as unknown as Pokedex,
          });
        } catch {
          console.warn('Invalid metadata syntax');
          return;
        }
      })
      .catch((error) => console.warn(error));
    metadataRequests.value.push(useAsyncState(metadataRequest, undefined));
  }
});

const metadataRequests: Ref<
  UseAsyncStateReturn<FileData<Data> | undefined, [], true>[]
> = ref([]);

const nCompletedMetadataRequests = computed(() =>
  metadataRequests.value.reduce(
    (prev, cur) => prev + (cur.isLoading ? 0 : 1),
    0
  )
);

const progressText = computed(() =>
  listRequest.data.value === undefined
    ? ''
    : nCompletedMetadataRequests.value ===
      listRequest.data.value.metadataUpdateds.length
    ? undefined
    : `${nCompletedMetadataRequests.value}/${listRequest.data.value.metadataUpdateds.length}`
);
</script>
