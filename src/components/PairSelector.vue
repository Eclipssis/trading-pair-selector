<script setup>
import { ref, computed } from 'vue'
import { useTradingStore } from '@/stores/tradingStore'
import { maxPairsAmountInSelect } from '@/helpers/constants'

const store = useTradingStore()
const searchTerm = ref('')
const isOpen = ref(false)

const filteredPairs = computed(() => {
  if (!searchTerm.value) {
    return store.allPairs.slice(0, maxPairsAmountInSelect)
  }
  return store.allPairs
    .filter(
      (p) =>
        p.symbol.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        p.baseAsset.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        p.quoteAsset.toLowerCase().includes(searchTerm.value.toLowerCase()),
    )
    .slice(0, maxPairsAmountInSelect)
})

const isSelected = (pair) => {
  return store.selectedPairs.some((p) => p.symbol === pair.symbol)
}

const togglePair = (pair) => {
  if (isSelected(pair)) {
    store.removePair(pair.symbol)
  } else {
    store.selectPair(pair)
  }
}
</script>

<template>
  <div class="w-full max-w-md lg:max-w-xl mx-auto">
    <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
      <div class="relative">
        <button
          @click="isOpen = !isOpen"
          class="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-left flex items-center justify-between"
        >
          <span>Select a pair...</span>
          <svg
            class="w-4 h-4"
            :class="{ 'rotate-180': isOpen }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </button>

        <div
          v-if="isOpen"
          class="absolute z-10 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl"
        >
          <div class="p-2">
            <input
              type="text"
              v-model="searchTerm"
              placeholder="Search..."
              class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <ul class="max-h-60 overflow-y-auto">
            <li v-if="store.isLoading" class="px-4 py-2 text-gray-500">Loading pairs...</li>
            <li
              v-for="pair in filteredPairs"
              :key="pair.symbol"
              @click="togglePair(pair)"
              class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center justify-between"
            >
              <div class="flex items-center">
                <img :src="pair.iconUrl" class="w-6 h-6 mr-3 rounded-full" alt="" />
                <span>{{ pair.baseAsset }}/{{ pair.quoteAsset }}</span>
              </div>
              <span v-if="isSelected(pair)" class="text-blue-500">&#10003;</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
