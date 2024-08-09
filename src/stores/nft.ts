import { defineStore } from 'pinia';
import { Pokedex } from '@fairfooddata/types';

export const useNftStore = defineStore('nft', {
  state: () => ({
    nfts: [] as Pokedex[],
  }),
});
