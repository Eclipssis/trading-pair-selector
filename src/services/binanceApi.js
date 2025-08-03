import apiClient from './apiClient'
import { defaultKlineChartLimit, defaultKlineChartInterval } from '@/helpers/constants'

const WSS_BASE_URL = import.meta.env.VITE_WSS_BASE_URL
let tickerSocket = null

export const getSymbolCandles = async (
  symbol,
  interval = defaultKlineChartInterval,
  limit = defaultKlineChartLimit,
) => {
  try {
    return await apiClient.get('/uiKlines', {
      params: {
        symbol,
        interval,
        limit,
      },
    })
  } catch (error) {
    console.log('Failed to fetch symbol candles:', error)
  }
}

export const getExchangeInfo = async () => {
  try {
    return await apiClient.get('/exchangeInfo')
  } catch (error) {
    console.log('Failed to fetch exchange info:', error)
  }
}

export const connectTickerWebSocket = (symbols, onMessageCallback) => {
  if (tickerSocket) {
    tickerSocket.close()
  }

  if (!symbols?.length) {
    return
  }

  const streams = symbols.map((symbol) => `${symbol.toLowerCase()}@ticker`).join('/')
  tickerSocket = new WebSocket(`${WSS_BASE_URL}/stream?streams=${streams}`)
  tickerSocket.onmessage = (event) => {
    onMessageCallback(JSON.parse(event.data).data)
  }
  tickerSocket.onerror = (error) => {
    console.error('Ticker WebSocket Error:', error)
  }

  return tickerSocket
}

export const connectKlineWebSocket = (symbol, onMessageCallback, interval) => {
  if (!symbol) return

  const klineSocket = new WebSocket(`${WSS_BASE_URL}/ws/${symbol.toLowerCase()}@kline_${interval}`)
  klineSocket.onmessage = (event) => {
    onMessageCallback(JSON.parse(event.data))
  }
  klineSocket.onerror = (error) => {
    console.error('Kline WebSocket Error:', error)
  }

  return klineSocket
}
