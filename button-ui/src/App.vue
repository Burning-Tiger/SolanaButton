<script setup lang="ts">
import SolanaButton from './components/SolanaButton.vue'

import { WalletMultiButton } from "solana-wallets-vue";
</script>

<template>
  <wallet-multi-button></wallet-multi-button>
  <SolanaButton/>
</template>