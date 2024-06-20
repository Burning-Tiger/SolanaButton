<script setup lang="ts">
  import { clickCount, click } from '../ClickCountState';
</script>

<template>
  <div class="card">
    <button type="button" @click="click">count is {{ clickCount }}</button>
  </div>
</template>
