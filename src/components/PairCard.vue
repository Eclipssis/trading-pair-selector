<script setup>
import { computed } from 'vue'
import { useTradingStore } from '@/stores/tradingStore'

const tradingStore = useTradingStore()
const pairs = computed(() => tradingStore.selectedPairsWithData)

defineProps({
  pair: {
    type: Object,
    required: () => {},
  },
})

const selectPairForChart = (symbol) => {
  tradingStore.setActiveChartSymbol(symbol)
}
</script>

<template>
  <div
    class="relative sm:min-h-36 p-2 sm:p-4 rounded-lg shadow-sm cursor-pointer transition-all duration-300 group"
    :class="{
      'bg-white dark:bg-gray-800 hover:shadow-gray-400 hover:shadow-md dark:hover:shadow-slate-500':
        tradingStore.activeChartSymbol !== pair.symbol,
      'bg-blue-100 dark:bg-blue-900 ring-2 ring-blue-500':
        tradingStore.activeChartSymbol === pair.symbol,
    }"
    @click="selectPairForChart(pair.symbol)"
  >
    <button
      v-if="tradingStore.activeChartSymbol !== pair.symbol || pairs.length < 2"
      @click.stop="tradingStore.removePair(pair.symbol)"
      class="absolute top-0 right-2 text-2xl text-red-500 hover:text-red-700 dark:hover:text-red-300 cursor-pointer group-hover:visible group-hover:opacity-100 invisible opacity-0 ease-in-out delay-200 duration-200 transition-all"
    >
      &times;
    </button>

    <div class="flex items-center mb-1 sm:mb-3">
      <img
        :src="pair.iconUrl"
        class="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 rounded-full"
        :alt="`${pair.symbol}-icon`"
      />
      <div>
        <p class="font-bold text-sm sm:text-lg">{{ pair.baseAsset }}/{{ pair.quoteAsset }}</p>
        <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{{ pair.symbol }}</p>
      </div>
    </div>
    <div v-if="pair.price">
      <p
        class="text-xl font-mono"
        :class="{
          'text-green-500': pair.price > pair.prevPrice,
          'text-red-500': pair.price < pair.prevPrice,
        }"
      >
        ${{ pair.price }}
      </p>
      <p
        class="text-md"
        :class="{
          'text-green-600 dark:text-green-400': pair.isPositive,
          'text-red-600 dark:text-red-400': !pair.isPositive,
        }"
      >
        {{ pair.changePercent }}% (24h)
      </p>
    </div>
    <div v-else class="text-gray-500">Loading...</div>
  </div>
</template>
