import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { useWallet } from 'solana-wallets-vue';
import SolanaWallets from "solana-wallets-vue";
import "solana-wallets-vue/styles.css";
import { Connection, clusterApiUrl, SystemProgram, Transaction, PublicKey } from '@solana/web3.js';


import {
  PhantomWalletAdapter,
  //SlopeWalletAdapter,
  //SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { initProgram } from './anchor/setup';


const walletOptions = {
  wallets: [
    new PhantomWalletAdapter()
  ],
  autoConnect: true,
};

createApp(App)
.use(SolanaWallets
    , walletOptions
)
.mount('#app')

await initProgram();

// NOT USED, but kept for reference if needed.
const sendOneLamportToRandomAddress = async () => {
  const connection = new Connection(clusterApiUrl('devnet'))
  const { publicKey, sendTransaction } = useWallet();
  if (!publicKey.value) return;

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: publicKey.value,
      toPubkey: new PublicKey("CQbYzRRdLrfqFBcfJYszQDMtRKE2ccMYXyCKp1yB81uN"),
      lamports: 1,
    })
  );
  const signature = await sendTransaction(transaction, connection);
  console.log(signature);
  console.log("SENT");
};

// must cast as any to set property on window
const _global = (window /* browser */ || global /* node */) as any
_global.s = sendOneLamportToRandomAddress