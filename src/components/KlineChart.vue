<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { createChart, CandlestickSeries } from 'lightweight-charts'
import { useTradingStore } from '@/stores/tradingStore'
import { connectKlineWebSocket, getSymbolCandles } from '@/services/binanceApi'
import { chartHeadingMap, defaultChartHeight, defaultKlineChartInterval } from '@/helpers/constants'
import { useTheme } from '@/composables/useTheme'

const { theme } = useTheme()
const chartContainer = ref(null)
const tradingStore = useTradingStore()
const pairs = computed(() => tradingStore.selectedPairsWithData)

let chart = null
let series = null
let klineSocket = null

const chartOptions = {
  light: {
    layout: {
      background: { color: '#ffffff' },
      textColor: '#191919',
    },
    grid: {
      vertLines: { color: '#e1e1e1' },
      horzLines: { color: '#e1e1e1' },
    },
  },
  dark: {
    layout: {
      background: { color: '#1f2937' },
      textColor: '#d1d5db',
    },
    grid: {
      vertLines: { color: '#374151' },
      horzLines: { color: '#374151' },
    },
  },
}

const setupChart = () => {
  if (!chartContainer.value) return

  chart = createChart(chartContainer.value, {
    width: chartContainer.value.clientWidth,
    height: defaultChartHeight,
    ...chartOptions[theme.value],
  })

  series = chart.addSeries(CandlestickSeries, {
    upColor: '#22c55e',
    downColor: '#ef4444',
    borderDownColor: '#ef4444',
    borderUpColor: '#22c55e',
    wickDownColor: '#ef4444',
    wickUpColor: '#22c55e',
  })
}

const subscribeToKlineData = (symbol) => {
  if (!symbol) {
    series?.setData([])
    return
  }

  if (klineSocket) {
    klineSocket.close()
  }

  series?.setData([])

  getSymbolCandles(symbol).then((response) => {
    const convertedData = response.data.map((data) => {
      const [time, open, high, low, close] = data

      return {
        time: time / 1000,
        open: parseFloat(open),
        high: parseFloat(high),
        low: parseFloat(low),
        close: parseFloat(close),
      }
    })

    series?.setData(convertedData)

    klineSocket = connectKlineWebSocket(
      symbol,
      (data) => {
        const { t: time, o: open, h: high, l: low, c: close } = data.k

        series?.update({
          time: time / 1000,
          open: parseFloat(open),
          high: parseFloat(high),
          low: parseFloat(low),
          close: parseFloat(close),
        })
      },
      defaultKlineChartInterval,
    )
  })
}

onMounted(() => {
  if (tradingStore.activeChartSymbol) {
    subscribeToKlineData(tradingStore.activeChartSymbol)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  if (chart) {
    chart.remove()
    chart = null
  }
  if (klineSocket) {
    klineSocket.close()
  }
})

watch(
  () => tradingStore.activeChartSymbol,
  (newSymbol) => {
    if (!chart) {
      nextTick(() => {
        setupChart()
      })
    }
    subscribeToKlineData(newSymbol)
  },
)

watch(
  () => theme.value,
  (newTheme) => {
    if (chart) {
      chart.applyOptions(chartOptions[newTheme])
    }
  },
)

const onResize = () => {
  if (chart && chartContainer.value) {
    chart.resize(chartContainer.value.clientWidth, defaultChartHeight)
  }
}

window.addEventListener('resize', onResize)
</script>

<template>
  <div
    v-if="tradingStore.activeChartSymbol"
    class="mt-8 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg"
  >
    <h3 class="text-xl font-semibold mb-4">
      {{ chartHeadingMap[defaultKlineChartInterval] }} Chart for
      {{ tradingStore.activeChartSymbol }}
    </h3>
    <div ref="chartContainer" class="w-full h-[400px]"></div>
  </div>
  <div
    v-if="!tradingStore.activeChartSymbol || !pairs.length"
    class="mt-8 text-center text-gray-500 dark:text-gray-400"
  >
    <p>Click on a pair from the list above to display its chart.</p>
  </div>
</template>
