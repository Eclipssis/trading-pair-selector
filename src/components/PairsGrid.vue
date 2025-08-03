<script setup>
import PairCard from './PairCard.vue'
import { useTradingStore } from '@/stores/tradingStore'
import { computed } from 'vue'

const store = useTradingStore()
const pairs = computed(() => store.selectedPairsWithData)
</script>

<template>
  <div v-if="store.selectedPairs.length > 0" class="mt-4 sm:mt-8">
    <h2 class="text-2xl font-semibold mb-4">Selected Pairs</h2>
    <div
      class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4"
    >
      <PairCard v-for="pair in pairs" :key="pair.symbol" :pair="pair"></PairCard>
    </div>
  </div>
</template>
