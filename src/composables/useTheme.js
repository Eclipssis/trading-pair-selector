import { ref, onMounted, computed, watch } from 'vue'
import { THEMES } from '@/helpers/constants'

const theme = ref(THEMES.Light)
const isDarkMode = computed(() => theme.value === THEMES.Dark)

export function useTheme() {
  const applyTheme = () => {
    if (theme.value === THEMES.Dark) {
      document.documentElement.classList.add(THEMES.Dark)
    } else {
      document.documentElement.classList.remove(THEMES.Dark)
    }
  }

  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      theme.value = savedTheme
    }
    applyTheme()
  }

  const toggleTheme = () => {
    theme.value = theme.value === THEMES.Light ? THEMES.Dark : THEMES.Light
  }

  watch(theme, (newTheme) => {
    localStorage.setItem('theme', newTheme)
    applyTheme()
  })

  onMounted(initTheme)

  return {
    theme,
    isDarkMode,
    toggleTheme,
  }
}
