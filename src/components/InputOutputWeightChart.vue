<template>
  <div class="row justify-center">
    <div
      class="chart-container"
      style="position: relative; height: 300px; width: calc(80%)"
    >
      <Line id="chart" :options="chartOptions" :data="chartData" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Chart,
  ChartOptions,
  ChartData,
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
  Filler,
  Legend,
  Tooltip,
} from 'chart.js';
import { computed } from 'vue';
import { FoodInstance, ProductInstance } from '@fairfooddata/types';
import { useChartFiltersStore } from 'src/stores/chartFilters';
import { Line } from 'vue-chartjs';
import { useNftStore } from 'src/stores/nft';

Chart.register(
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
  Filler,
  Legend,
  Tooltip
);

const chartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  datasets: {
    line: {
      borderWidth: 2,
      fill: 'start',
      tension: 0.5,
      cubicInterpolationMode: 'monotone',
    },
  },
  plugins: {
    filler: {
      propagate: false,
    },
  },
};

// function coincident(a: Location | null, b: Location | null) {
//   return (
//     a !== null &&
//     b !== null &&
//     a.coordinates[0] === b.coordinates[0] &&
//     a.coordinates[1] === b.coordinates[1]
//   );
// }

const startDate = computed(() => useChartFiltersStore().startDate);
const endDate = computed(() => useChartFiltersStore().endDate);

const nftsByDate = computed(() => {
  const oneDay = 24 * 60 * 60;

  const nftsByDate: FoodInstance[][] = [];

  for (let date = startDate.value; date <= endDate.value; date += oneDay) {
    nftsByDate.push(
      useNftStore()
        .filteredTokens.map<ProductInstance>(
          ({ metadata: { instance } }) => instance
        )
        .filter(
          (instance): instance is FoodInstance => instance?.category === 'food'
        )
        .filter(
          (instance) =>
            'process' in instance &&
            instance.process &&
            instance.process.timestamp >= date &&
            instance.process.timestamp < date + oneDay
        )
    );
  }

  return nftsByDate;
});

const chartData = computed<ChartData<'line'>>(() => ({
  labels: new Array<number>(
    Math.round((endDate.value - startDate.value) / 24 / 60 / 60)
  )
    .fill(0)
    .map((_, i) => new Date((startDate.value + i * 24 * 60 * 60) * 1000))
    .map((date) => date.toLocaleDateString()),
  datasets: [
    {
      label: 'Input Weight',
      data: nftsByDate.value.map((nfts) =>
        nfts.reduce(
          (prev, cur) =>
            prev +
            (cur.process
              ? cur.process?.inputInstances.reduce(
                  (prev, cur) => prev + cur.quantity,
                  0
                )
              : 0),
          0
        )
      ),
      backgroundColor: 'rgba(74, 140, 191, 0.3)',
      borderColor: 'rgba(74, 140, 191, 1)',
      order: 1,
    },
    {
      label: 'Output Weight',
      data: nftsByDate.value.map((nfts) =>
        nfts.reduce((prev, cur) => prev + cur.quantity, 0)
      ),
      backgroundColor: 'rgba(81, 140, 6, 0.3)',
      borderColor: 'rgb(81, 140, 6)',
      order: 0,
    },
  ],
}));
</script>
