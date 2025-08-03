<script setup>
import { onMounted } from 'vue'
import { useTheme } from '@/composables/useTheme'
import { useTradingStore } from '@/stores/tradingStore'
import PairSelector from '@/components/PairSelector.vue'
import SelectedPairsGrid from '@/components/PairsGrid.vue'
import KLineChart from '@/components/KLineChart.vue'
import HeaderBlock from '@/components/HeaderBlock.vue'

const tradingStore = useTradingStore()

useTheme()

onMounted(() => {
  tradingStore.fetchPairs().then(() => {
    tradingStore.getPairsFromLocalStorage()
  })
})
</script>

<template>
  <div
    class="bg-gray-100 dark:bg-gray-900 min-h-screen pb-12 text-gray-900 dark:text-gray-100 transition-colors duration-300"
  >
    <HeaderBlock></HeaderBlock>

    <main class="container mx-auto p-4">
      <div class="grid grid-cols-1 lg:grid-cols-3 sm:gap-8">
        <div class="lg:col-span-3">
          <PairSelector />
        </div>
        <div class="lg:col-span-3">
          <SelectedPairsGrid />
        </div>
        <div class="lg:col-span-3">
          <KLineChart />
        </div>
      </div>
    </main>
  </div>
</template>
