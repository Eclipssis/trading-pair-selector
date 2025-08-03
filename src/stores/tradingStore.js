import { defineStore } from 'pinia'
import { getExchangeInfo, connectTickerWebSocket } from '@/services/binanceApi'
import { exchangeHistoryStatuses } from '@/helpers/constants'

export const useTradingStore = defineStore('trading', {
  state: () => ({
    allPairs: [],
    selectedPairs: [],
    realtimeData: {},
    activeChartSymbol: null,
    isLoading: false,
  }),

  getters: {
    selectedPairsWithData: (state) => {
      return state.selectedPairs.map((pair) => ({
        ...pair,
        ...state.realtimeData[pair.symbol],
      }))
    },
  },

  actions: {
    async fetchPairs() {
      this.isLoading = true
      try {
        const response = await getExchangeInfo()
        this.allPairs = response.data.symbols
          .filter((pair) => {
            return pair.status === exchangeHistoryStatuses.TRADING && pair.isSpotTradingAllowed
          })
          .map((pair) => {
            return {
              symbol: pair.symbol,
              baseAsset: pair.baseAsset,
              quoteAsset: pair.quoteAsset,
              iconUrl: `https://cdn.jsdelivr.net/gh/vadimmalykhin/binance-icons/crypto/${pair.baseAsset.toLocaleLowerCase()}.svg`,
            }
          })
      } catch (error) {
        console.error('Failed to fetch trading pairs:', error)
      } finally {
        this.isLoading = false
      }
    },

    selectPair(pair) {
      if (!this.selectedPairs.find((p) => p.symbol === pair.symbol)) {
        this.selectedPairs.push(pair)
        this.updateTickerSubscription()
        this.saveSelectedPairsToLocalStorage()
      }
    },

    removePair(symbol) {
      this.selectedPairs = this.selectedPairs.filter((pair) => pair.symbol !== symbol)
      if (this.activeChartSymbol === symbol) {
        this.activeChartSymbol = null
      }
      this.updateTickerSubscription()
      this.saveSelectedPairsToLocalStorage()
    },

    updateTickerSubscription() {
      const symbols = this.selectedPairs.map((pair) => pair.symbol)
      connectTickerWebSocket(symbols, (data) => {
        const { s: symbol, c: price, P: changePercent } = data

        this.realtimeData[symbol] = {
          price: parseFloat(price),
          prevPrice: this.realtimeData[symbol]?.price,
          changePercent: parseFloat(changePercent).toFixed(2),
          isPositive: parseFloat(changePercent) >= 0,
        }
      })
    },

    setActiveChartSymbol(symbol) {
      this.activeChartSymbol = symbol
    },

    saveSelectedPairsToLocalStorage() {
      localStorage.setItem(
        'selectedPairs',
        JSON.stringify(this.selectedPairs.map((pair) => pair.symbol)),
      )
    },

    getPairsFromLocalStorage() {
      const savedSymbols = JSON.parse(localStorage.getItem('selectedPairs') || '[]')
      if (this.allPairs.length > 0) {
        this.selectedPairs = savedSymbols
          .map((symbol) => this.allPairs.find((pair) => pair.symbol === symbol))
          .filter(Boolean)
        this.updateTickerSubscription()
      }
    },
  },
})
