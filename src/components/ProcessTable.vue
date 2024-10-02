<template>
  <div class="row justify-center q-my-xl">
    <q-table
      :rows="rows"
      :columns="columns"
      class="col-xl-6 col-md-8 col-sm-12"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="expiryDate" :props="props">
            <a
              :href="`${packagePageUrl}/?tokenId=${props.row.tokenId}`"
              target="_blank"
              >{{ new Date(props.row.date).toLocaleDateString() }}
              <q-icon name="open_in_new"
            /></a>
          </q-td>
          <q-td key="processType" :props="props">
            {{ props.row.processType }}
          </q-td>
          <q-td key="input" :props="props">
            {{ props.row.input }}
          </q-td>
          <q-td key="output" :props="props">
            {{ props.row.output }}
          </q-td>
          <q-td key="recipe" :props="props">
            {{ props.row.recipe }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import { ProductInstance } from '@fairfooddata/types';
import { QTableColumn } from 'quasar';
import { useNftStore } from 'src/stores/nft';
import { computed } from 'vue';

const filteredNfts = computed(() => useNftStore().filteredTokens);

interface TableData {
  tokenId: string;
  date: number;
  processType: string;
  input: number;
  output: number;
  recipe: string;
}

const packagePageUrl = process.env.PACKAGE_PAGE_URL;

const rows = computed<TableData[]>((): TableData[] =>
  filteredNfts.value.flatMap((nft) =>
    allInstances(nft.metadata.instance).flatMap((instance) =>
      'process' in instance && instance.process
        ? [
            {
              tokenId: nft.id,
              processType: `${instance.process.type}`,
              input: instance.process.inputInstances.reduce(
                (prev, cur) =>
                  prev +
                  (typeof cur === 'object' && 'type' in cur ? cur.quantity : 0),
                0
              ),
              date:
                instance.process.inputInstances.reduce(
                  (prev, cur) =>
                    Math.min(
                      typeof cur.instance === 'object' &&
                        'expiryDate' in cur.instance &&
                        cur.instance.expiryDate !== undefined
                        ? cur.instance.expiryDate
                        : Number.POSITIVE_INFINITY,
                      prev
                    ),
                  Number.POSITIVE_INFINITY
                ) * 1000,
              output: instance.quantity,
              recipe:
                'knowHow' in instance.process
                  ? instance.process.knowHow.owner
                  : '',
            },
          ]
        : []
    )
  )
);

// function childProcesses(process: Process) {
//   return process.inputInstances
//     .map((inputInstance) =>
//       typeof inputInstance.instance === 'string'
//         ? []
//         : 'process' in inputInstance.instance
//         ? inputInstance.instance.process
//           ? [inputInstance.instance.process]
//           : []
//         : []
//     )
//     .flat();
// }

// function allProcesses(process: Process): Process[] {
//   return [
//     process,
//     ...childProcesses(process)
//       .map((process) => allProcesses(process))
//       .flat(),
//   ];
// }

function childInstances(instance: ProductInstance): ProductInstance[] {
  return 'process' in instance && instance.process !== undefined
    ? instance.process.inputInstances
        .map((inputInstance) =>
          typeof inputInstance.instance === 'string' ||
          !('type' in inputInstance.instance)
            ? []
            : [inputInstance.instance]
        )
        .flat()
    : [];
}

function allInstances(instance: ProductInstance): ProductInstance[] {
  return [
    instance,
    ...childInstances(instance)
      .map((instance) => allInstances(instance))
      .flat(),
  ];
}

const columns: QTableColumn<TableData>[] = [
  {
    name: 'expiryDate',
    label: 'Date',
    field: 'date',
    required: true,
    sortable: true,
    rawSort: (a, b) => a - b,
    align: 'left',
  },
  {
    name: 'processType',
    label: 'Activity',
    field: 'processType',
    sortable: true,
    align: 'left',
  },
  {
    name: 'input',
    field: 'input',
    label: 'Input (g)',
  },
  {
    name: 'output',
    field: 'output',
    label: 'Output (g)',
  },
  {
    name: 'recipe',
    field: 'recipe',
    label: 'Recipe',
    align: 'left',
  },
];

// const processes = computed(() => filteredNfts.value.flatMap(()))
</script>
