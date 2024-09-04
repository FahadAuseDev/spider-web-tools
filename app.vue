<script lang="ts" setup>
import { Toaster } from 'vue-sonner'
</script>

<template>
  <NuxtLayout>
    <Toaster :position="'top-center'" rich-colors :duration="3000" />
    <NuxtPage />
  </NuxtLayout>
</template>