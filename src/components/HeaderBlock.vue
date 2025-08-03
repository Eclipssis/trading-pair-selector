<script setup>
import ThemeSwitcher from '@/components/ThemeSwitcher.vue'
</script>

<template>
  <header class="p-4 shadow-md bg-white dark:bg-gray-800">
    <div class="container mx-auto flex justify-between items-center">
      <h1 class="text-2xl font-bold">Trading Pair Selector</h1>
      <ThemeSwitcher />
    </div>
  </header>
</template>
